import type { Player } from '../../types.ts';
import { COMMON_WORDS, DRAW_TOPICS, JUST_ONE_WORDS, MOST_LIKELY } from './data.ts';
import type { CodenamesState, FakeArtistState, JustOneState, MindState, MostLikelyState, SuiteAction, SuiteClientState, SuiteGameId, SuiteGameState, Team } from './types.ts';

const COLORS = ['#fb7185','#38bdf8','#34d399','#fbbf24','#a78bfa','#f472b6','#22d3ee','#fb923c'];
const clean = (v: string) => v.trim().replace(/\s+/g, ' ').slice(0, 40);
const key = (v: string) => clean(v).toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g,'d');
export const shuffle = <T,>(a: readonly T[], random=Math.random) => { const x=[...a]; for(let i=x.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[x[i],x[j]]=[x[j],x[i]];} return x; };
const pick = <T,>(a: readonly T[], random=Math.random) => a[Math.floor(random()*a.length)];

export function createSuiteGame(gameId: SuiteGameId, players: Player[], random=Math.random): SuiteGameState {
  if (players.length < 4 || players.length > 20) throw new Error('Games require 4-20 players');
  if (gameId === 'fake-artist') {
    const topic=pick(DRAW_TOPICS,random); const order=shuffle(players.map(p=>p.id),random);
    return {gameId,stage:'DRAW',players,topic:topic[0],topicEn:topic[1],fakeId:pick(players,random).id,turnOrder:order,turnIndex:0,round:1,strokes:[],votes:{},accusedId:null,winner:null,tie:false};
  }
  if (gameId === 'codenames') {
    const ps=shuffle(players,random); const teams={} as Record<string,Team>; ps.forEach((p,i)=>teams[p.id]=i%2?'BLUE':'RED');
    const red=ps.find(p=>teams[p.id]==='RED')!.id, blue=ps.find(p=>teams[p.id]==='BLUE')!.id;
    const words=shuffle(COMMON_WORDS,random).slice(0,25); const roles=shuffle<Team|'NEUTRAL'|'ASSASSIN'>([...Array(9).fill('RED'),...Array(8).fill('BLUE'),...Array(7).fill('NEUTRAL'),'ASSASSIN'] as any,random);
    return {gameId,stage:'CLUE',players,board:words.map((w,i)=>({word:w[0],wordEn:w[1],role:roles[i],revealed:false})),teams,spymasters:{RED:red,BLUE:blue},currentTeam:'RED',clue:'',clueNumber:0,guessesLeft:0,winner:null,message:''};
  }
  if (gameId === 'most-likely') {
    const qs=shuffle(MOST_LIKELY,random).slice(0,20);
    return {gameId,stage:'VOTE',players,round:1,prompt:qs[0][0],promptEn:qs[0][1],votes:{},scores:Object.fromEntries(players.map(p=>[p.id,0])),winners:[],questions:qs};
  }
  if (gameId === 'just-one') {
    const w=pick(JUST_ONE_WORDS,random); return {gameId,stage:'CLUE',players,round:1,guesserId:players[0].id,word:w[0],wordEn:w[1],clues:{},validClues:[],duplicateClues:[],answer:'',success:null,score:0};
  }
  return createMind(players,1,3,random);
}

function createMind(players:Player[],level:number,lives:number,random=Math.random):MindState{
  const cards=shuffle(Array.from({length:100},(_,i)=>i+1),random).slice(0,players.length*level);
  const hands=Object.fromEntries(players.map(p=>[p.id,[] as number[]]));
  cards.forEach((c,i)=>hands[players[i%players.length].id].push(c));
  Object.values(hands).forEach(h=>h.sort((a,b)=>a-b));
  return {gameId:'the-mind',stage:'PLAY',players,level,lives,hands,pile:[],lastPlayedBy:null,lostCards:[],won:null};
}

function allSubmitted(state:{players:Player[]}, record:Record<string,unknown>, exclude?:string){return state.players.filter(p=>p.id!==exclude).every(p=>record[p.id]!==undefined);}
function otherTeam(t:Team):Team{return t==='RED'?'BLUE':'RED';}
function remaining(state:CodenamesState,team:Team){return state.board.filter(c=>c.role===team&&!c.revealed).length;}

export function applySuiteAction(state:SuiteGameState, actorId:string, action:SuiteAction, random=Math.random):SuiteGameState {
  if(!state.players.some(p=>p.id===actorId)) return state;
  if(state.gameId==='fake-artist'){
    if(action.type==='DRAW_STROKE'&&state.stage==='DRAW'&&state.turnOrder[state.turnIndex]===actorId&&action.points.length>1){
      const pts=action.points.slice(0,240).map(p=>({x:Math.max(0,Math.min(1,p.x)),y:Math.max(0,Math.min(1,p.y))}));
      let turnIndex=state.turnIndex+1, round=state.round, stage:FakeArtistState['stage']='DRAW'; if(turnIndex>=state.turnOrder.length){turnIndex=0;round++;if(round>2)stage='VOTE';}
      return {...state,strokes:[...state.strokes,{playerId:actorId,color:COLORS[state.turnOrder.indexOf(actorId)%COLORS.length],points:pts}],turnIndex,round,stage};
    }
    if(action.type==='VOTE_PLAYER'&&state.stage==='VOTE'&&actorId!==action.targetId&&state.players.some(p=>p.id===action.targetId)){
      const votes={...state.votes,[actorId]:action.targetId}; if(!allSubmitted(state,votes))return{...state,votes};
      const counts:Record<string,number>={}; Object.values(votes).forEach(id=>counts[id]=(counts[id]||0)+1); const high=Math.max(...Object.values(counts)); const top=Object.keys(counts).filter(id=>counts[id]===high);
      if(top.length!==1)return{...state,votes:{},tie:true}; const accusedId=top[0]; return {...state,votes,accusedId,stage:accusedId===state.fakeId?'FAKE_GUESS':'GAME_OVER',winner:accusedId===state.fakeId?null:'FAKE',tie:false};
    }
    if(action.type==='FAKE_GUESS'&&state.stage==='FAKE_GUESS'&&actorId===state.fakeId){const ok=key(action.guess)===key(state.topic)||key(action.guess)===key(state.topicEn);return{...state,stage:'GAME_OVER',winner:ok?'FAKE':'ARTISTS'};}
  }
  if(state.gameId==='codenames'){
    const team=state.teams[actorId];
    if(action.type==='GIVE_CLUE'&&state.stage==='CLUE'&&state.spymasters[state.currentTeam]===actorId&&clean(action.clue)&&action.count>=1&&action.count<=9)return{...state,stage:'GUESS',clue:clean(action.clue),clueNumber:action.count,guessesLeft:action.count,message:''};
    if(action.type==='GUESS_CARD'&&state.stage==='GUESS'&&team===state.currentTeam&&state.spymasters[team]!==actorId){const card=state.board[action.index];if(!card||card.revealed)return state;const board=state.board.map((c,i)=>i===action.index?{...c,revealed:true}:c);if(card.role==='ASSASSIN')return{...state,board,stage:'GAME_OVER',winner:otherTeam(team),message:'ASSASSIN'};if(remaining({...state,board},'RED')===0)return{...state,board,stage:'GAME_OVER',winner:'RED',message:'ALL_FOUND'};if(remaining({...state,board},'BLUE')===0)return{...state,board,stage:'GAME_OVER',winner:'BLUE',message:'ALL_FOUND'};if(card.role!==team)return{...state,board,stage:'CLUE',currentTeam:otherTeam(team),clue:'',guessesLeft:0,message:'WRONG'};const left=state.guessesLeft-1;return left<=0?{...state,board,stage:'CLUE',currentTeam:otherTeam(team),clue:'',guessesLeft:0,message:''}:{...state,board,guessesLeft:left};}
    if(action.type==='END_TURN'&&state.stage==='GUESS'&&team===state.currentTeam&&state.spymasters[team]!==actorId)return{...state,stage:'CLUE',currentTeam:otherTeam(team),clue:'',guessesLeft:0,message:''};
  }
  if(state.gameId==='most-likely'&&action.type==='VOTE_PLAYER'&&state.stage==='VOTE'&&state.players.some(p=>p.id===action.targetId)){
    const votes={...state.votes,[actorId]:action.targetId};if(!allSubmitted(state,votes))return{...state,votes};const counts:Record<string,number>={};Object.values(votes).forEach(id=>counts[id]=(counts[id]||0)+1);const high=Math.max(...Object.values(counts));const winners=Object.keys(counts).filter(id=>counts[id]===high);const scores={...state.scores};winners.forEach(id=>scores[id]=(scores[id]||0)+high);return{...state,votes,winners,scores,stage:'RESULT'};
  }
  if(state.gameId==='just-one'){
    if(action.type==='SUBMIT_CLUE'&&state.stage==='CLUE'&&actorId!==state.guesserId&&clean(action.clue)){const clues={...state.clues,[actorId]:clean(action.clue)};if(!allSubmitted(state,clues,state.guesserId))return{...state,clues};const groups:Record<string,string[]>={};Object.values(clues).forEach(c=>(groups[key(c)]??=[]).push(c));const validClues=Object.values(groups).filter(x=>x.length===1&&key(x[0])!==key(state.word)&&key(x[0])!==key(state.wordEn)).flat();const duplicateClues=Object.values(groups).filter(x=>x.length>1||key(x[0])===key(state.word)||key(x[0])===key(state.wordEn)).flat();return{...state,clues,validClues,duplicateClues,stage:'GUESS'};}
    if((action.type==='SUBMIT_ANSWER'||action.type==='SKIP_ANSWER')&&state.stage==='GUESS'&&actorId===state.guesserId){const answer=action.type==='SUBMIT_ANSWER'?clean(action.answer):'';const success=key(answer)===key(state.word)||key(answer)===key(state.wordEn);return{...state,answer,success,score:state.score+(success?1:0),stage:'RESULT'};}
  }
  if(state.gameId==='the-mind'&&action.type==='PLAY_CARD'&&state.stage==='PLAY'){
    const hand=state.hands[actorId]||[];if(!hand.includes(action.card))return state;const all=Object.values(state.hands).flat();const lost=all.filter(c=>c<action.card);const hands=Object.fromEntries(Object.entries(state.hands).map(([id,cards])=>[id,cards.filter(c=>c!==action.card&&!lost.includes(c))]));const lives=state.lives-(lost.length?1:0);const pile=[...state.pile,...lost,action.card].sort((a,b)=>a-b);if(lives<=0)return{...state,hands,pile,lives:0,lostCards:lost,lastPlayedBy:actorId,stage:'GAME_OVER',won:false};if(Object.values(hands).every(h=>h.length===0))return{...state,hands,pile,lives,lostCards:lost,lastPlayedBy:actorId,stage:'LEVEL_RESULT'};return{...state,hands,pile,lives,lostCards:lost,lastPlayedBy:actorId};
  }
  return state;
}

export function nextSuiteRound(state:SuiteGameState, random=Math.random):SuiteGameState{
  if(state.gameId==='most-likely'){const qs=state.questions||MOST_LIKELY;if(state.round>=qs.length||state.round>=20)return{...state,stage:'GAME_OVER'};const q=qs[state.round];return{...state,round:state.round+1,prompt:q[0],promptEn:q[1],votes:{},winners:[],stage:'VOTE'};}
  if(state.gameId==='just-one'){if(state.round>=state.players.length)return{...state,stage:'GAME_OVER'};const w=pick(JUST_ONE_WORDS,random);return{...state,round:state.round+1,guesserId:state.players[state.round%state.players.length].id,word:w[0],wordEn:w[1],clues:{},validClues:[],duplicateClues:[],answer:'',success:null,stage:'CLUE'};}
  if(state.gameId==='the-mind'){if(state.stage!=='LEVEL_RESULT')return state;if(state.level>=6)return{...state,stage:'GAME_OVER',won:true};return createMind(state.players,state.level+1,state.lives,random);}
  return createSuiteGame(state.gameId,state.players,random);
}

export function clientState(state:SuiteGameState,playerId:string):SuiteClientState{
  const copy=structuredClone(state) as SuiteGameState; let secret:SuiteClientState['secret']={};
  if(copy.gameId==='fake-artist'){secret={role:playerId===copy.fakeId?'FAKE':'ARTIST',topic:playerId===copy.fakeId?'':copy.topic,topicEn:playerId===copy.fakeId?'':copy.topicEn};copy.fakeId='';copy.topic='';copy.topicEn='';}
  if(copy.gameId==='codenames'){const team=copy.teams[playerId];secret={team,role:copy.spymasters[team]===playerId?'SPYMASTER':'OPERATIVE'};if(copy.spymasters[team]!==playerId)copy.board=copy.board.map(c=>({...c,role:c.revealed?c.role:'NEUTRAL'}));}
  if(copy.gameId==='just-one'&&playerId===copy.guesserId){copy.word='';copy.wordEn='';}
  if(copy.gameId==='the-mind'){secret={hand:copy.hands[playerId]||[]};copy.hands=Object.fromEntries(Object.keys(copy.hands).map(id=>[id,id===playerId?copy.hands[id]:[]]));}
  return{game:copy,playerId,secret};
}
