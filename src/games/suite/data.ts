const pairs = (source: string) => source.trim().split('\n').map(line => line.split('|') as [string, string]);

export const DRAW_TOPICS = pairs(`
Con mèo|Cat
Con chó|Dog
Con voi|Elephant
Hươu cao cổ|Giraffe
Con khỉ|Monkey
Sư tử|Lion
Con hổ|Tiger
Gấu trúc|Panda
Gấu bắc cực|Polar bear
Chuột túi|Kangaroo
Ngựa vằn|Zebra
Con thỏ|Rabbit
Con rùa|Turtle
Bạch tuộc|Octopus
Cá mập|Shark
Cá heo|Dolphin
Cá voi|Whale
Chim cánh cụt|Penguin
Đại bàng|Eagle
Cú mèo|Owl
Con vẹt|Parrot
Chim bồ câu|Pigeon
Con thiên nga|Swan
Con vịt|Duck
Con gà trống|Rooster
Con lợn|Pig
Con bò|Cow
Con cừu|Sheep
Con dê|Goat
Con ngựa|Horse
Con lạc đà|Camel
Tê giác|Rhino
Hà mã|Hippo
Cá sấu|Crocodile
Khủng long|Dinosaur
Con rắn|Snake
Con ếch|Frog
Con nhện|Spider
Bọ cạp|Scorpion
Con ong|Bee
Bướm hoa|Butterfly
Chuồn chuồn|Dragonfly
Con kiến|Ant
Con bọ rùa|Ladybug
Con ốc sên|Snail
Con cua|Crab
Tôm hùm|Lobster
Sao biển|Starfish
Cá ngựa|Seahorse
Sứa biển|Jellyfish
Mực ống|Squid
Cá vàng|Goldfish
Cá hề|Clownfish
Con dơi|Bat
Con sóc|Squirrel
Con nhím|Hedgehog
Con cáo|Fox
Chó sói|Wolf
Linh cẩu|Hyena
Báo đốm|Cheetah
Hải cẩu|Seal
Hải mã|Walrus
Chim công|Peacock
Chim hồng hạc|Flamingo
Chim bói cá|Kingfisher
Gõ kiến|Woodpecker
Chim én|Swallow
Đà điểu|Ostrich
Kỳ lân|Unicorn
Con rồng|Dragon
Phượng hoàng|Phoenix
Người cá|Mermaid
Quái vật|Monster
Con sâu|Caterpillar
Ve sầu|Cicada
Bọ ngựa|Mantis
Đom đóm|Firefly
Con rết|Centipede
Con giun|Earthworm
Con lươn|Eel
Cá đuối|Stingray
Cá kiếm|Swordfish
Cá nóc|Pufferfish
Cá ngừ|Tuna
Hàu biển|Oyster
Sò điệp|Scallop
Rùa biển|Sea turtle
Kỳ đà|Monitor lizard
Tắc kè|Gecko
Thằn lằn|Lizard
Lợn rừng|Wild boar
Bò tót|Bison
Chồn hương|Weasel
Thú mỏ vịt|Platypus
Gấu túi|Koala
Con lười|Sloth
Hải ly|Beaver
Rái cá|Otter
Báo đen|Panther
Chó pug|Pug dog
Chó poodle|Poodle
Mèo tam thể|Calico cat
Gà con|Chick
Vịt con|Duckling
Nòng nọc|Tadpole
Cá bay|Flying fish
Chim ruồi|Hummingbird
Cò trắng|Stork
Bồ nông|Pelican
Hải âu|Seagull
Quạ đen|Crow
Chim sẻ|Sparrow
Chim sếu|Crane
Bồ câu trắng|Dove
Gà tây|Turkey
Ngỗng tuyết|Snow goose
Khỉ đột|Gorilla
Vượn cáo|Lemur
Chuột đồng|Hamster
Chuột cống|Rat
Tên lửa|Rocket
Xe đạp|Bicycle
Bánh sinh nhật|Birthday cake
Đồng hồ|Clock
Máy ảnh|Camera
Kính râm|Sunglasses
Điện thoại|Phone
Tai nghe|Headphones
Chiếc ô|Umbrella
Cái quạt|Fan
Cái ghế|Chair
Cái bàn|Table
Giường ngủ|Bed
Tủ lạnh|Fridge
Tivi|Television
Máy tính|Computer
Bàn phím|Keyboard
Chuột máy tính|Mouse
Cái kéo|Scissors
Dao gọt|Knife
Cái thìa|Spoon
Cái dĩa|Fork
Đôi đũa|Chopsticks
Bát ăn cơm|Bowl
Cốc nước|Cup
Bình hoa|Vase
Ngọn nến|Candle
Bóng đèn|Light bulb
Đèn pin|Flashlight
Đèn ngủ|Lamp
Chìa khóa|Key
Ổ khóa|Padlock
Ví tiền|Wallet
Balo|Backpack
Vali|Suitcase
Sách vở|Book
Bút chì|Pencil
Bút bi|Pen
Cục tẩy|Eraser
Thước kẻ|Ruler
Bình sữa|Baby bottle
Cái gương|Mirror
Lược chải|Comb
Bàn chải|Toothbrush
Bánh xà phòng|Soap
Khăn mặt|Towel
Thùng rác|Trash bin
Cây chổi|Broom
Cây lau nhà|Mop
Bàn là|Iron
Máy giặt|Washing machine
Nồi cơm|Rice cooker
Cái chảo|Frying pan
Ấm đun nước|Kettle
Lò vi sóng|Microwave
Bình nước|Water bottle
Mũ bảo hiểm|Helmet
Mũ len|Beanie
Nón lá|Conical hat
Áo sơ mi|Shirt
Quần bò|Jeans
Váy đầm|Dress
Áo khoác|Jacket
Áo mưa|Raincoat
Đôi tất|Socks
Đôi giày|Shoes
Giày cao gót|High heels
Đôi dép|Slippers
Thắt lưng|Belt
Cà vạt|Necktie
Nhẫn cưới|Ring
Vòng cổ|Necklace
Vòng tay|Bracelet
Hoa tai|Earrings
Vương miện|Crown
Kính cận|Glasses
Ống nhòm|Binoculars
Kính lúp|Magnifying glass
La bàn|Compass
Bản đồ|Map
Quả địa cầu|Globe
Đồng hồ cát|Hourglass
Đồng hồ báo thức|Alarm clock
Cái cân|Scale
Hộp diêm|Matches
Bật lửa|Lighter
Pháo hoa|Fireworks
Quả bom|Bomb
Cái xô|Bucket
Cái xẻng|Shovel
Cái cuốc|Hoe
Cây búa|Hammer
Cái đinh|Nail
Cờ lê|Wrench
Tua vít|Screwdriver
Cưa gỗ|Saw
Máy khoan|Drill
Thang gấp|Ladder
Dây thừng|Rope
Cái còi|Whistle
Chuông cửa|Doorbell
Hòm thư|Mailbox
Phong bì|Envelope
Con tem|Stamp
Hộp quà|Gift box
Bong bóng|Balloon
Con diều|Kite
Chong chóng|Pinwheel
Xích đu|Swing
Bập bênh|Seesaw
Cầu trượt|Slide
Lò xo|Spring
Nam châm|Magnet
Cục pin|Battery
USB|Flash drive
Đĩa CD|Compact disc
Đàn guitar|Guitar
Đàn piano|Piano
Đàn violin|Violin
Trống da|Drum
Kèn trumpet|Trumpet
Ống sáo|Flute
Micro|Microphone
Loa đài|Speaker
Máy bay|Airplane
Trực thăng|Helicopter
Khinh khí cầu|Hot air balloon
Đĩa bay UFO|UFO
Tàu vũ trụ|Spaceship
Vệ tinh|Satellite
Xe ô tô|Car
Xe buýt|Bus
Xe cứu hỏa|Fire truck
Xe cứu thương|Ambulance
Xe cảnh sát|Police car
Xe taxi|Taxi
Xe tải|Truck
Xe ben|Dump truck
Xe bồn|Tanker truck
Xe trộn bê tông|Cement mixer
Xe cần cẩu|Crane truck
Xe máy xúc|Excavator
Xe ủi|Bulldozer
Xe nâng|Forklift
Xe rác|Garbage truck
Xe máy|Motorcycle
Xe tay ga|Scooter
Xe đạp điện|Electric bike
Xe xích lô|Cyclo
Xe ba gác|Tricycle cart
Xe ngựa|Horse carriage
Xe kéo|Rickshaw
Xe trượt tuyết|Sled
Xe gôn|Golf cart
Xe go-kart|Go-kart
Xe đua|Race car
Xe cút kít|Wheelbarrow
Xe đẩy em bé|Stroller
Xe lăn|Wheelchair
Tàu hỏa|Train
Tàu điện ngầm|Subway train
Tàu cao tốc|Bullet train
Xe điện mặt đất|Tram
Cáp treo|Cable car
Thuyền buồm|Sailboat
Tàu thủy|Ship
Du thuyền|Yacht
Tàu ngầm|Submarine
Cano|Speedboat
Phà chở khách|Ferry
Thuyền thúng|Coracle
Thuyền kayak|Kayak
Bè tre|Bamboo raft
Thuyền rồng|Dragon boat
Ván lướt sóng|Surfboard
Ván trượt tuyết|Skis
Ván trượt skateboard|Skateboard
Giày patin|Roller skates
Giày trượt băng|Ice skates
Dù lượn|Paraglider
Áo phao bơi|Life jacket
Phao cứu sinh|Lifebuoy
Mỏ neo tàu|Anchor
Chân vịt|Propeller
Kem ốc quế|Ice cream cone
Kem que|Popsicle
Bánh mì|Baguette
Bánh pizza|Pizza
Hamburger|Burger
Bánh hotdog|Hotdog
Khoai tây chiên|Fries
Gà rán|Fried chicken
Bánh donut|Donut
Bánh ngọt cupcake|Cupcake
Kẹo mút|Lollipop
Thỏi socola|Chocolate bar
Bánh quy|Cookie
Bát phở|Pho bowl
Bát mì|Ramen bowl
Hộp cơm|Lunchbox
Sushi|Sushi roll
Cơm cuộn kimbap|Kimbap
Bánh bao|Steamed bun
Há cảo|Dumpling
Trứng ốp la|Fried egg
Miếng phô mai|Cheese wedge
Bắp ngô|Corn cob
Củ cà rốt|Carrot
Quả cà chua|Tomato
Quả khoai tây|Potato
Củ hành tây|Onion
Củ tỏi|Garlic
Quả ớt|Chili pepper
Quả nấm|Mushroom
Cây súp lơ|Broccoli
Quả dưa chuột|Cucumber
Quả bí ngô|Pumpkin
Bắp cải|Cabbage
Quả táo|Apple
Quả chuối|Banana
Quả cam|Orange
Quả dưa hấu|Watermelon
Quả dâu tây|Strawberry
Chùm nho|Grapes
Quả dứa|Pineapple
Quả xoài|Mango
Quả chanh|Lemon
Quả đào|Peach
Quả bơ|Avocado
Quả lê|Pear
Quả anh đào|Cherry
Quả dừa|Coconut
Quả đu đủ|Papaya
Hạt dẻ|Chestnut
Hạt lạc|Peanut
Bỏng ngô|Popcorn
Cốc cà phê|Coffee cup
Cốc trà sữa|Boba tea
Chai rượu|Wine bottle
Lon nước ngọt|Soda can
Cốc bia|Beer mug
Cốc nước cam|Orange juice
Kem ly|Sundae
Thịt xiên|Kebab skewer
Bò bít tết|Steak
Xúc xích|Sausage
Đùi gà|Chicken drumstick
Con cá nướng|Grilled fish
Con tôm luộc|Boiled shrimp
Cua hấp|Steamed crab
Nồi lẩu|Hot pot
Bánh chưng|Square rice cake
Bánh tét|Cylindrical rice cake
Nem rán|Spring roll
Bánh xèo|Crispy pancake
Bánh cuốn|Rice roll
Bánh mì que|Breadstick
Bánh waffle|Waffle
Bánh pancake|Pancake
Bánh bông lan|Sponge cake
Bánh sừng bò|Croissant
Kẹo cao su|Bubblegum
Thạch rau câu|Jelly
Mặt trời|Sun
Mặt trăng|Moon
Ngôi sao|Star
Đám mây|Cloud
Cầu vồng|Rainbow
Sấm sét|Lightning
Hạt mưa|Raindrop
Bông tuyết|Snowflake
Người tuyết|Snowman
Ngọn núi|Mountain
Núi lửa|Volcano
Tảng băng|Iceberg
Hòn đảo|Island
Bãi biển|Beach
Sa mạc|Desert
Cây xương rồng|Cactus
Cây dừa|Palm tree
Cây thông|Pine tree
Cây sồi|Oak tree
Cây tre|Bamboo
Khu rừng|Forest
Thác nước|Waterfall
Dòng sông|River
Hồ nước|Lake
Hang động|Cave
Vách đá|Cliff
Đồi cát|Sand dune
Đồng cỏ|Meadow
Bông hoa hồng|Rose
Hoa hướng dương|Sunflower
Hoa sen|Lotus
Hoa tulip|Tulip
Hoa cúc|Daisy
Cỏ ba lá|Clover
Chiếc lá|Leaf
Hạt mầm|Seedling
Quả sồi|Acorn
Cành cây|Branch
Khúc gỗ|Log
Hòn đá|Rock
Hạt cát|Sand
Ngọn lửa|Flame
Cơn lốc xoáy|Tornado
Cơn bão|Storm
Sao băng|Shooting star
Hành tinh|Planet
Sao Thổ|Saturn
Dải ngân hà|Milky Way
Hố đen|Black hole
Cực quang|Aurora
Mặt trời lặn|Sunset
Mặt trời mọc|Sunrise
Sóng biển|Ocean wave
Đầm lầy|Swamp
Suối nước nóng|Hot spring
Rạn san hô|Coral reef
Vỏ ốc|Seashell
Ngọc trai|Pearl
Viên kim cương|Diamond
Khối vàng|Gold bar
Bụi cây|Bush
Dây leo|Vine
Gốc cây|Tree stump
Tổ ong|Beehive
Mạng nhện|Spiderweb
Tổ chim|Bird nest
Hố đất|Hole in ground
Vũng nước|Puddle
Mù sương|Fog
Sương mù|Mist
Khói|Smoke
Tro tàn|Ashes
Dung nham|Lava
Động đất|Earthquake fissure
Sao chổi|Comet
Thiên thạch|Meteor
Vành đai sao|Asteroid ring
Bầu trời đêm|Night sky
Vầng trăng khuyết|Crescent moon
Trăng rằm|Full moon
Lâu đài|Castle
Tòa tháp|Tower
Ngôi nhà|House
Tòa nhà chọc trời|Skyscraper
Kim tự tháp|Pyramid
Ngọn hải đăng|Lighthouse
Cối xay gió|Windmill
Cây cầu|Bridge
Đường hầm|Tunnel
Lều cắm trại|Tent
Lều tuyết igloo|Igloo
Ngôi chùa|Pagoda
Nhà thờ|Church
Cổng thành|City gate
Bức tường|Wall
Hàng rào|Fence
Đài phun nước|Fountain
Tượng đài|Monument
Công viên|Park
Sân bóng|Soccer pitch
Hồ bơi|Swimming pool
Rạp xiếc|Circus tent
Nhà hát|Theater
Bảo tàng|Museum
Bệnh viện|Hospital
Trường học|School
Thư viện|Library
Ngân hàng|Bank
Khách sạn|Hotel
Nhà ga|Train station
Sân bay|Airport
Bến cảng|Port
Cây xăng|Gas station
Trạm xe buýt|Bus stop
Nhà máy|Factory
Nhà kho|Warehouse
Trang trại|Barn
Chuồng gà|Coop
Chuồng ngựa|Stable
Nhà gỗ|Cabin
Ngôi nhà ma|Haunted house
Cối xay nước|Watermill
Giếng nước|Water well
Cột đèn đường|Streetlight
Ghế công viên|Park bench
Thùng thư|Postbox
Bốt điện thoại|Phone booth
Đèn giao thông|Traffic light
Cửa sổ|Window
Cửa ra vào|Door
Cổng sắt|Iron gate
Mái nhà|Roof
Ống khói|Chimney
Ban công|Balcony
Cầu thang|Stairs
Thang máy|Elevator
Sân thượng|Rooftop
Tầng hầm|Basement
Cầu trượt nước|Water slide
Bánh xe đu quay|Ferris wheel
`);

export const COMMON_WORDS: [string, string][] = pairs(`
MỎ NEO|ANCHOR
QUẢ TÁO|APPLE
TẠP DỀ|APRON
MŨI TÊN|ARROW
PHI HÀNH GIA|ASTRONAUT
BẢN ĐỒ|ATLAS
CỰC QUANG|AURORA
QUẢ BƠ|AVOCADO
HUY HIỆU|BADGE
BÓNG BAY|BALLOON
CÂY TRE|BAMBOO
QUẢ CHUỐI|BANANA
NGÂN HÀNG|BANK
CHUỒNG TRẠI|BARN
BÃI BIỂN|BEACH
CON GẤU|BEAR
CÁI CHUÔNG|BELL
QUẢ MỌNG|BERRY
XE ĐẠP|BICYCLE
CON CHIM|BIRD
BÁNH QUY|BISCUIT
LƯỠI DAO|BLADE
CHIẾC CHĂN|BLANKET
HOA NỞ|BLOSSOM
CON THUYỀN|BOAT
CHAI NƯỚC|BOTTLE
CÂY CẦU|BRIDGE
CÂY CHỔI|BROOM
BÀN CHẢI|BRUSH
BONG BÓNG|BUBBLE
CÁI XÔ|BUCKET
CON BƯỚM|BUTTERFLY
NHÀ GỖ|CABIN
XƯƠNG RỒNG|CACTUS
MÁY ẢNH|CAMERA
NGỌN NẾN|CANDLE
HẺM NÚI|CANYON
THUYỀN TRƯỞNG|CAPTAIN
TẤM THẢM|CARPET
LÂU ĐÀI|CASTLE
HANG ĐỘNG|CAVE
ĐÀN CELLO|CELLO
CÁI GHẾ|CHAIR
PHÔ MAI|CHEESE
ANH ĐÀO|CHERRY
CỜ VUA|CHESS
HÌNH TRÒN|CIRCLE
RẠP XIẾC|CIRCUS
ĐỒNG HỒ|CLOCK
ĐÁM MÂY|CLOUD
CỎ BA LÁ|CLOVER
SAO CHỔI|COMET
LA BÀN|COMPASS
BÁNH COOKIE|COOKIE
SAN HÔ|CORAL
VƯƠNG MIỆN|CROWN
PHA LÊ|CRYSTAL
CÁI TÁCH|CUP
RÈM CỬA|CURTAIN
VŨ CÔNG|DANCER
SA MẠC|DESERT
KIM CƯƠNG|DIAMOND
XÚC XẮC|DICE
BÁC SĨ|DOCTOR
CÁ HEO|DOLPHIN
CON RỒNG|DRAGON
GIẤC MƠ|DREAM
CÁI TRỐNG|DRUM
ĐẠI BÀNG|EAGLE
TRÁI ĐẤT|EARTH
TIẾNG VANG|ECHO
ĐỘNG CƠ|ENGINE
LÔNG VŨ|FEATHER
HÀNG RÀO|FENCE
CÁNH ĐỒNG|FIELD
NGỌN LỬA|FIRE
BÔNG HOA|FLOWER
KHU RỪNG|FOREST
ĐÀI PHUN|FOUNTAIN
CON CÁO|FOX
KHUNG TRANH|FRAME
SƯƠNG GIÁ|FROST
NGÂN HÀ|GALAXY
KHU VƯỜN|GARDEN
BÓNG MA|GHOST
KHỔNG LỒ|GIANT
SÔNG BĂNG|GLACIER
GĂNG TAY|GLOVE
VÀNG BẠC|GOLD
CHÙM NHO|GRAPE
BÃI CỎ|GRASS
GUITAR|GUITAR
CÁI BÚA|HAMMER
HẢI CẢNG|HARBOR
CHIM ƯNG|HAWK
TRÁI TIM|HEART
MŨ BẢO HIỂM|HELMET
NGỌN ĐỒI|HILL
MẬT ONG|HONEY
LƯỠI CÂU|HOOK
CON NGỰA|HORSE
KHÁCH SẠN|HOTEL
NGÔI NHÀ|HOUSE
BĂNG TRÔI|ICEBERG
LỀU TUYẾT|IGLOO
HÒN ĐẢO|ISLAND
ÁO KHOÁC|JACKET
VIÊN NGỌC|JEWEL
RỪNG RẬM|JUNGLE
CHUỘT TÚI|KANGAROO
ẤM ĐUN|KETTLE
CHÌA KHÓA|KEY
CON DIỀU|KITE
CÁI THANG|LADDER
HỒ NƯỚC|LAKE
ĐÈN LỒNG|LANTERN
CHIẾC LÁ|LEAF
QUẢ CHANH|LEMON
THƯ VIỆN|LIBRARY
HẢI ĐĂNG|LIGHTHOUSE
SƯ TỬ|LION
THẰN LẰN|LIZARD
Ổ KHÓA|LOCK
PHÉP THUẬT|MAGIC
NAM CHÂM|MAGNET
QUẢ XOÀI|MANGO
BẢN ĐỒ SỐ|MAP
CẨM THẠCH|MARBLE
MẶT NẠ|MASK
ĐỒNG CỎ|MEADOW
GƯƠNG SOI|MIRROR
CON KHỈ|MONKEY
MẶT TRĂNG|MOON
NGỌN NÚI|MOUNTAIN
CON CHUỘT|MOUSE
CÂY NẤM|MUSHROOM
CÂY KIM|NEEDLE
TỔ CHIM|NEST
BAN ĐÊM|NIGHT
NINJA|NINJA
ĐẠI DƯƠNG|OCEAN
Ô LIU|OLIVE
NHÀ HÁT|OPERA
QUẢ CAM|ORANGE
HOA LAN|ORCHID
GẤU TRÚC|PANDA
TỜ GIẤY|PAPER
CHIẾC DÙ|PARACHUTE
CÔNG VIÊN|PARK
NGỌC TRAI|PEARL
HẠT TIÊU|PEPPER
PIANO|PIANO
DÃ NGOẠI|PICNIC
CÁI GỐI|PILLOW
PHI CÔNG|PILOT
CÂY THÔNG|PINE
HẢI TẶC|PIRATE
HÀNH TINH|PLANET
CÁI ĐĨA|PLATE
QUẢ MẬN|PLUM
TÚI ÁO|POCKET
KIM TỰ THÁP|PYRAMID
NỮ HOÀNG|QUEEN
CON THỎ|RABBIT
RA ĐA|RADAR
CẦU VỒNG|RAINBOW
TRANG TRẠI|RANCH
CON QUẠ|RAVEN
DÒNG SÔNG|RIVER
NGƯỜI MÁY|ROBOT
TÊN LỬA|ROCKET
HOA HỒNG|ROSE
YÊN NGỰA|SADDLE
THỦY THỦ|SAILOR
BÃI CÁT|SAND
SAO THỔ|SATURN
TRƯỜNG HỌC|SCHOOL
CÁI BÓNG|SHADOW
CÁ MẬP|SHARK
VỎ SÒ|SHELL
CHIẾC KHIÊN|SHIELD
CON TÀU|SHIP
CHIẾC GIÀY|SHOE
TÍN HIỆU|SIGNAL
BẠC TRẮNG|SILVER
TRƯỢT PATIN|SKATE
CON RẮN|SNAKE
TUYẾT TRẮNG|SNOW
CON NHỆN|SPIDER
CÁI THÌA|SPOON
MÙA XUÂN|SPRING
QUẢNG TRƯỜNG|SQUARE
NGÔI SAO|STAR
NHÀ GA|STATION
CƠN BÃO|STORM
DÂU TÂY|STRAWBERRY
TÀU NGẦM|SUBMARINE
MÙA HÈ|SUMMER
MẶT TRỜI|SUN
HƯỚNG DƯƠNG|SUNFLOWER
THANH KIẾM|SWORD
CÁI BÀN|TABLE
KÍNH THIÊN VĂN|TELESCOPE
NGÔI ĐỀN|TEMPLE
CON HỔ|TIGER
BÁNH MÌ NƯỚNG|TOAST
CÀ CHUA|TOMATO
TÒA THÁP|TOWER
TÀU HỎA|TRAIN
CÂY CỐI|TREE
TAM GIÁC|TRIANGLE
KÈN ĐỒNG|TRUMPET
ĐƯỜNG HẦM|TUNNEL
CON RÙA|TURTLE
CHIẾC Ô|UMBRELLA
KỲ LÂN|UNICORN
THUNG LŨNG|VALLEY
VẢI NHUNG|VELVET
VIOLIN|VIOLIN
NÚI LỬA|VOLCANO
TOA XE|WAGON
CÁ VOI|WHALE
BÁNH XE|WHEEL
CỬA SỔ|WINDOW
ĐÔI CÁNH|WING
MÙA ĐÔNG|WINTER
PHÙ THỦY|WIZARD
CHÓ SÓI|WOLF
NGỰA VẰN|ZEBRA
SÂN BAY|AIRPORT
CON HẺM|ALLEY
HỔ PHÁCH|AMBER
THIÊN THẦN|ANGEL
CON KIẾN|ANT
BẮC CỰC|ARCTIC
ÁO GIÁP|ARMOR
HỌA SĨ|ARTIST
TRO TÀN|ASH
TIỆM BÁNH|BAKERY
CON DƠI|BAT
CỤC PIN|BATTERY
HẢI LY|BEAVER
CON ONG|BEE
BỌ CÁNH CỨNG|BEETLE
THẮT LƯNG|BELT
GHẾ DÀI|BENCH
QUYỂN SÁCH|BOOK
ĐÔI ỦNG|BOOT
CÂY CUNG|BOW
CÁI BÁT|BOWL
CHIẾC HỘP|BOX
CÀNH CÂY|BRANCH
BÁNH MÌ|BREAD
VIÊN GẠCH|BRICK
SÚP LƠ|BROCCOLI
ĐỒNG THIẾC|BRONZE
CON SUỐI|BROOK
CÚC ÁO|BUTTON
LẠC ĐÀ|CAMEL
KẸO NGỌT|CANDY
THẺ BÀI|CARD
LỄ HỘI|CARNIVAL
CÀ RỐT|CARROT
XE ĐẨY|CART
SÒNG BẠC|CASINO
DÂY XÍCH|CHAIN
PHẤN VIẾT|CHALK
QUÁN QUÂN|CHAMPION
ỐNG KHÓI|CHIMNEY
NHÀ THỜ|CHURCH
THÀNH PHỐ|CITY
VÁCH ĐÁ|CLIFF
XE KHÁCH|COACH
QUẢ DỪA|COCONUT
MẬT MÃ|CODE
CÀ PHÊ|COFFEE
ĐỒNG XU|COIN
HÒA NHẠC|CONCERT
CHÂU LỤC|CONTINENT
ĐỒNG ĐỎ|COPPER
CẦN CẨU|CRANE
LẠCH NƯỚC|CREEK
THỢ LẶN|DIVER
BÁNH DONUT|DONUT
CÁNH CỬA|DOOR
CON VỊT|DUCK
BỤI BẶM|DUST
LỤC BẢO|EMERALD
NÔNG TRẠI|FARM
LÁ CỜ|FLAG
CÂY SÁO|FLUTE
BÓNG ĐÁ|FOOTBALL
CÁI DĨA|FORK
CON ẾCH|FROG
GA RA|GARAGE
CỔNG THÀNH|GATE
GÁC CỔNG|GATEKEEPER
THỦY TINH|GLASS
CON DÊ|GOAT
ĐÀN HẠC|HARP
TRỰC THĂNG|HELICOPTER
CHÂN TRỜI|HORIZON
BỆNH VIỆN|HOSPITAL
BĂNG ĐÁ|ICE
MỰC VIẾT|INK
CÔN TRÙNG|INSECT
BÀN LÀ|IRON
NGÀ VOI|IVORY
MỨT NGỌT|JAM
THẨM PHÁN|JUDGE
HIỆP SĨ|KNIGHT
GẤU TÚI|KOALA
ĐÈN BÀN|LAMP
TIA LASER|LASER
DUNG NHAM|LAVA
LUẬT SƯ|LAWYER
TIA CHỚP|LIGHTNING
HOA SEN|LOTUS
MÁY MÓC|MACHINE
VOI MA MÚT|MAMMOTH
KHU CHỢ|MARKET
HUY CHƯƠNG|MEDAL
SAO BĂNG|METEOR
SỮA TƯƠI|MILK
BẠC HÀ|MINT
MÔ TƠ|MOTOR
BẢO TÀNG|MUSEUM
HẢI QUÂN|NAVY
VÒNG CỔ|NECKLACE
Y TÁ|NURSE
CÂY SỒI|OAK
CỦ HÀNH|ONION
CUNG ĐIỆN|PALACE
BÁO ĐEN|PANTHER
QUẢ ĐÀO|PEACH
PHƯỢNG HOÀNG|PHOENIX
TẨU THUỐC|PIPE
PIZZA|PIZZA
AO NƯỚC|POND
BỎNG NGÔ|POPCORN
HOÀNG TỬ|PRINCE
BÍ NGÔ|PUMPKIN
ĐÀI PHÁT THANH|RADIO
CƠN MƯA|RAIN
ĐĨA HÁT|RECORD
CHIẾC NHẪN|RING
CON ĐƯỜNG|ROAD
CHIM OANH|ROBIN
MÁI NHÀ|ROOF
CÁNH BUỒM|SAIL
ĐÁ SAPPHIRE|SAPPHIRE
VỆ TINH|SATELLITE
KHĂN QUÀNG|SCARF
NHÀ KHOA HỌC|SCIENTIST
BỌ CẠP|SCORPION
MÀN HÌNH|SCREEN
HẢI CẨU|SEAL
HẠT GIỐNG|SEED
CON CỪU|SHEEP
BỘ XƯƠNG|SKELETON
BẦU TRỜI|SKY
ĐÔI DÉP|SLIPPER
LÀN KHÓI|SMOKE
ĐÔI TẤT|SOCK
NGƯỜI LÍNH|SOLDIER
VŨ TRỤ|SPACE
HÌNH CẦU|SPHERE
BỌT BIỂN|SPONGE
SÂN VẬN ĐỘNG|STADIUM
SÂN KHẤU|STAGE
HÒN ĐÁ|STONE
ĐƯỜNG PHỐ|STREET
ĐƯỜNG ĂN|SUGAR
XÍCH ĐU|SWING
TAXI|TAXI
RẠP HÁT|THEATER
TIẾNG SẤM|THUNDER
TẤM VÉ|TICKET
NGỌN ĐUỐC|TORCH
MÁY CÀY|TRACTOR
KHO BÁU|TREASURE
BỨC TƯỜNG|WALL
THÁC NƯỚC|WATERFALL
NGỌN SÓNG|WAVE
MẠNG NHỆN|WEB
LÚA MÌ|WHEAT
CÁI CÒI|WHISTLE
CƠN GIÓ|WIND
SÂN NHÀ|YARD
DU THUYỀN|YACHT
HẠT SỒI|ACORN
ĐẠI LỘ|AVENUE
HÚNG QUẾ|BASIL
MŨ TRÙM|BONNET
VÒNG TAY|BRACELET
GIÓ NHẸ|BREEZE
VIÊN NHỘNG|CAPSULE
TUYẾT TÙNG|CEDAR
ÁO DÀI|AO DAI
NÓN LÁ|CONICAL HAT
BÁNH CHƯNG|CHUNG CAKE
HOA MAI|APRICOT BLOSSOM
HOA ĐÀO|PEACH BLOSSOM
PHỞ BÒ|BEEF PHO
NƯỚC MẮM|FISH SAUCE
SẦU RIÊNG|DURIAN
TRÀ SỮA|BOBA TEA
CÀ PHÊ SỮA|MILK COFFEE
BIA HƠI|DRAFT BEER
CHẢ LỤA|PORK ROLL
NEM CHUA|SOUR PORK
GỎI CUỐN|SPRING ROLL
BÁNH XÈO|CREPE
HỦ TIẾU|HU TIEU
BÚN BÒ|BUN BO
BÚN CHẢ|BUN CHA
BÁNH CUỐN|RICE ROLL
CHÈ BƯỞI|POMELO DESSERT
XÔI GẤC|RED STICKY RICE
TÀO PHỚ|TOFU PUDDING
BÁNH BAO|BAO BUN
HỘT VỊT LỘN|BALUT
CƠM TẤM|BROKEN RICE
BÚN ĐẬU|TOFU NOODLE
MẮM TÔM|SHRIMP PASTE
CHẢ CÁ|FISH CAKE
CƠM NIÊU|CLAYPOT RICE
BÒ BÍT TẾT|BEEFSTEAK
LẨU THÁI|HOT POT
GÀ RÁN|FRIED CHICKEN
HAMBURGER|HAMBURGER
KHOAI TÂY CHIÊN|FRIES
KEM CÂY|POPSICLE
KẸO MÚT|LOLLIPOP
SOCOLA|CHOCOLATE
BÁNH KEM|CAKE
BÁNH BÔNG LAN|SPONGE CAKE
BÁNH MACARON|MACARON
KẸO CAO SU|GUM
SỮA CHUA|YOGURT
BƠ ĐỘNG VẬT|BUTTER
SỮA ĐẶC|CONDENSED MILK
NƯỚC DỪA|COCONUT WATER
NƯỚC MÍA|SUGARCANE
NƯỚC CAM|ORANGE JUICE
SINH TỐ|SMOOTHIE
RƯỢU VANG|WINE
BIA LON|CAN BEER
RƯỢU ĐẾ|MOONSHINE
SÂM BANH|CHAMPAGNE
COCKTAIL|COCKTAIL
TRÀ CHANH|LEMON TEA
TRÀ ĐÀO|PEACH TEA
NƯỚC KHOÁNG|WATER
CHUA CAY|SPICY SOUR
NGỌT NGÀO|SWEET
ĐẮNG NGHÉT|BITTER
MẶN MÒI|SALTY
GIÒN RỤM|CRISPY
MỀM MẠI|SOFT
DAI NGON|CHEWY
NÓNG HỔI|HOT
LẠNH BUỐT|FREEZING
BÉO NGẬY|CREAMY
THƠM THO|AROMATIC
CHUA CHÁT|TART
CÀI ÁO|BROOCH
BÔNG TAI|EARRING
MẶT DÂY|PENDANT
LẮC CHÂN|ANKLET
VÒNG NGỌC|JADE BANGLE
KẸP TÓC|HAIRPIN
BĂNG ĐÔ|HEADBAND
CÀ VẠT|TIE
NƠ CỔ|BOWTIE
KHĂN TAY|HANDKERCHIEF
TÚI XÁCH|PURSE
BALO|BACKPACK
VALI|SUITCASE
CẶP TÀI LIỆU|BRIEFCASE
VÍ TIỀN|WALLET
HỘP ĐỰNG|CASE
ÁO MƯA|RAINCOAT
ÁO GIÓ|WINDBREAKER
ÁO PHAO|PUFFER
ÁO LEN|SWEATER
ÁO VEST|BLAZER
ÁO SƠ MI|SHIRT
ÁO THUN|TSHIRT
QUẦN TÂY|SLACKS
QUẦN BÒ|JEANS
QUẦN ĐÙI|SHORTS
VÁY NGẮN|SKIRT
ĐẦM DẠ HỘI|GOWN
ÁO CƯỚI|WEDDING DRESS
ĐỒ NGỦ|PAJAMAS
ÁO LÓT|UNDERWEAR
ĐỒ BƠI|SWIMWEAR
GIÀY THỂ THAO|SNEAKERS
GIÀY CAO GÓT|HIGH HEELS
GIÀY DA|LEATHER SHOES
SANDAL|SANDALS
DÉP TỔ ONG|SLIPPERS
ỦNG LỘI NƯỚC|WADERS
GIÀY LƯỜI|LOAFERS
TẤT CỔ NGẮN|ANKLE SOCKS
GĂNG TAY LEN|MITTENS
KHĂN CHOÀNG|SHAWL
MŨ LƯỠI TRAI|CAP
MŨ PHỚT|FEDORA
NÓN BẢO HIỂM|HELMET
MŨ TAI BÈO|BUCKET HAT
KÍNH RÂM|SUNGLASSES
KÍNH ÁP TRÒNG|CONTACTS
GỌNG KÍNH|FRAMES
KÍNH BƠI|GOGGLES
ĐỒNG HỒ ĐEO TAY|WRISTWATCH
ĐỒNG HỒ BỎ TÚI|POCKET WATCH
MÁY SẤY|HAIRDRIER
MÁY UỐN|CURLER
DAO CẠO|RAZOR
KEM ĐÁNH RĂNG|TOOTHPASTE
NƯỚC SÚC MIỆNG|MOUTHWASH
DẦU GỘI|SHAMPOO
SỮA TẮM|BODY WASH
BÔNG TẨY TRANG|COTTON PAD
SON MÔI|LIPSTICK
PHẤN MẮT|EYESHADOW
MASCARA|MASCARA
KẺ MẮT|EYELINER
MÁ HỒNG|BLUSH
KEM CHỐNG NẮNG|SUNSCREEN
NƯỚC HOA|PERFUME
SƠN MÓNG|NAIL POLISH
BẤM MÓNG|CLIPPER
BÔNG NGOÁY TAI|Q-TIP
BĂNG GẠC|BANDAGE
THUỐC CẢM|COLD PILL
VITAMIN|VITAMINS
DẦU GIÓ|MEDICATED OIL
NHIỆT KẾ|THERMOMETER
CÂN SỨC KHỎE|SCALE
MÁY HUYẾT ÁP|BP MONITOR
KÍNH LÚP|MAGNIFIER
ỐNG TIÊM|SYRINGE
BÌNH SỮA|BABY BOTTLE
TÃ LÓT|DIAPER
NÚM GIẢ|PACIFIER
CŨI TRẺ EM|CRIB
GHẾ ĂN DẶM|HIGH CHAIR
GẤU BÔNG|TEDDY
BÚP BÊ|DOLL
BỘ XẾP HÌNH|PUZZLE
ĐỒ CHƠI GỖ|WOODEN TOY
XE ĐỒ CHƠI|TOY CAR
SÚNG NƯỚC|WATER GUN
CHONG CHÓNG|PINWHEEL
CON QUAY|TOP
YOYO|YOYO
RUBIK|RUBIKS
BÀI TÂY|CARDS
CỜ CÁ NGỰA|LUDO
CỜ TỶ PHÚ|MONOPOLY
BÀN BI-A|POOL TABLE
CƠ BI-A|POOL CUE
BÓNG BÀN|PING PONG
VỢT BÓNG BÀN|PADDLE
QUẢ BÓNG RỔ|BASKETBALL
BÓNG CHUYỀN|VOLLEYBALL
BÓNG CHÀY|BASEBALL
GẬY BÓNG CHÀY|BAT
VỢT TENNIS|TENNIS RACKET
VỢT CẦU LÔNG|BADMINTON
QUẢ CẦU LÔNG|SHUTTLECOCK
CẦN CÂU|FISHING ROD
MỒI CÂU|LURE
VÁN TRƯỢT|SKATEBOARD
VÁN LƯỚT SÓNG|SURFBOARD
GIÀY PATIN|INLINE SKATE
XE SCOOTER|SCOOTER
DÙ LƯỢN|PARAGLIDER
DÙ NHẢY|PARACHUTE
KÍNH LẶN|DIVING MASK
ỐNG THỞ|SNORKEL
CHÂN VỊT|FINS
BÌNH DƯỠNG KHÍ|SCUBA TANK
VÁN TUYẾT|SNOWBOARD
GẬY TRƯỢT TUYẾT|SKI POLE
XE TRƯỢT TUYẾT|SLED
LỀU TRẠI|TENT
TÚI NGỦ|SLEEPING BAG
BẾP GA MINI|CAMP STOVE
BÌNH GIỮ NHIỆT|FLASK
ĐÈN PIN|TORCH
DAO ĐA NĂNG|SWISS ARMY KNIFE
BẬT LỬA|LIGHTER
HỘP DIÊM|MATCHBOX
CÁI CUỐC|HOE
CÁI XẺNG|SHOVEL
CÁI CÀO|RAKE
KÉO TỈA CÂY|SHEARS
BÌNH TƯỚI|WATERING CAN
VÒI NƯỚC|HOSE
MÁY CẮT CỎ|LAWNMOWER
XE CÚT KÍT|WHEELBARROW
CHẬU CÂY|POT
GIÀN HOA|TRELLIS
PHÂN BÓN|FERTILIZER
ĐẤT TRỒNG|SOIL
CÂY CẢNH|BONSAI
HỒ CÁ|FISH POND
LỒNG CHIM|BIRD CAGE
CHUỒNG CHÓ|DOGHOUSE
NHÀ MÈO|CAT CONDO
BÁT ĂN CHÓ|DOG BOWL
DÂY DẮT|LEASH
RỌ MÕM|MUZZLE
ĐỒ CHƠI GẶM|CHEW TOY
BỂ THỦY SINH|AQUARIUM
MÁY SỤC KHÍ|AIR PUMP
ĐÈN SƯỞI|HEAT LAMP
CÂY CÀO MÓNG|SCRATCH POST
CÁT VỆ SINH|CAT LITTER
LƯỢC CHẢI LÔNG|PET COMB
SỮA TẮM CHÓ|PET SHAMPOO
XƯƠNG GẶM|PET BONE
BÀN LÀM VIỆC|DESK
GHẾ XOAY|SWIVEL CHAIR
KỆ SÁCH|BOOKSHELF
TỦ HỒ SƠ|FILE CABINET
BẢNG TRẮNG|WHITEBOARD
BÚT DẠ|MARKER
MÁY CHIẾU|PROJECTOR
MÀN CHIẾU|PROJECTION SCREEN
MÁY IN|PRINTER
MÁY SCAN|SCANNER
MÁY HỦY TÀI LIỆU|SHREDDER
BẤM KIM|STAPLER
KẸP GIẤY|PAPERCLIP
BĂNG KEO|TAPE
DAO RỌC GIẤY|BOX CUTTER
THƯỚC KẺ|RULER
MÁY TÍNH BÀN|DESKTOP
LAPTOP|LAPTOP
BÀN PHÍM|KEYBOARD
CHUỘT KHÔNG DÂY|WIRELESS MOUSE
LOA MÁY TÍNH|SPEAKERS
WEBCAM|WEBCAM
MICRÔ|MIC
TAI NGHE CHỤP|HEADSET
SẠC LAPTOP|LAPTOP CHARGER
DÂY MẠNG|LAN CABLE
BỘ PHÁT WIFI|ROUTER
Ổ CỨNG|HARD DRIVE
USB DI ĐỘNG|THUMB DRIVE
THẺ NHỚ|SD CARD
ĐẦU ĐỌC THẺ|CARD READER
ĐIỆN THOẠI BÀN|LANDLINE
BẢNG VẼ ĐIỆN TỬ|DRAWING TABLET
BÚT CẢM ỨNG|STYLUS
PIN DỰ PHÒNG|POWER BANK
DÂY CÁP SẠC|USB CABLE
CỦ SẠC|WALL ADAPTER
Ổ CẮM ĐIỆN|POWER STRIP
CẦU CHÌ|FUSE
CÔNG TẮC|SWITCH
BÓNG ĐÈN LED|LED BULB
ĐÈN CHÙM|CHANDELIER
ĐÈN NGỦ|NIGHTLIGHT
ĐÈN BÀN HỌC|DESK LAMP
ĐÈN HUỲNH QUANG|FLUORESCENT
ĐÈN NĂNG LƯỢNG|SOLAR LIGHT
ĐÈN ĐƯỜNG|STREET LIGHT
QUẠT TRẦN|CEILING FAN
QUẠT CÂY|STAND FAN
QUẠT HƠI NƯỚC|MISTING FAN
MÁY ĐIỀU HÒA|AIR CONDITIONER
MÁY LỌC KHÔNG KHÍ|AIR PURIFIER
MÁY HÚT ẨM|DEHUMIDIFIER
MÁY TẠO ẨM|HUMIDIFIER
MÁY SƯỞI|SPACE HEATER
TỦ LẠNH|FRIDGE
TỦ ĐÔNG|FREEZER
MÁY RỬA BÁT|DISHWASHER
LÒ NƯỚNG|OVEN
LÒ VI SÓNG|MICROWAVE
NỒI CHIÊN KHÔNG DẦU|AIR FRYER
BẾP ĐIỆN TỪ|INDUCTION HOB
BẾP GA|GAS STOVE
NỒI CƠM ĐIỆN|RICE COOKER
NỒI ÁP SUẤT|PRESSURE POT
MÁY XAY SINH TỐ|BLENDER
MÁY ÉP CHẬM|SLOW JUICER
ẤM SIÊU TỐC|ELECTRIC KETTLE
MÁY PHA CÀ PHÊ|COFFEE MAKER
MÁY NƯỚNG BÁNH|TOASTER
NỒI LẨU ĐIỆN|ELECTRIC HOTPOT
BÁT ĂN|RICE BOWL
ĐĨA ĐỰNG|DINNER PLATE
CỐC THỦY TINH|TUMBLER
TÁCH TRÀ|TEACUP
BÌNH TRÀ|TEAPOT
LY RƯỢU VANG|WINE GLASS
CỐC BIA|BEER MUG
ĐÔI ĐŨA|CHOPSTICKS
CÁI NĨA|FORK
DAO CẮT THỊT|MEAT KNIFE
DAO GỌT HOA QUẢ|PARING KNIFE
CÁI THỚT|CHOPPING BOARD
CÁI CHẢO|PAN
CÁI NỒI|POT
NỒI ĐẤT|CLAY POT
CÁI RỔ|COLANDER
CÁI CHẬU|BASIN
HỘP ĐỰNG CƠM|LUNCHBOX
BÌNH NƯỚC|WATER JUG
GIƯỜNG NGỦ|BED
ĐỆM BÔNG|MATTRESS
CHIẾU TRÚC|BAMBOO MAT
GỐI NẰM|PILLOW
GỐI ÔM|BOLSTER
CHĂN BÔNG|DUVET
GA TRẢI GIƯỜNG|BEDSHEET
MÙNG NGỦ|MOSQUITO NET
TỦ QUẦN ÁO|WARDROBE
MÓC TREO ĐỒ|HANGER
KỆ ĐẦU GIƯỜNG|NIGHTSTAND
BÀN PHẤN|VANITY
BÀN TRANG ĐIỂM|DRESSER
GƯƠNG TOÀN THÂN|FULL MIRROR
RÈM CỬA SỔ|WINDOW BLIND
THẢM LAU CHÂN|DOORMAT
BỒN TẮM|BATHTUB
VÒI HOA SEN|SHOWER
BỒN CẦU|TOILET
CHẬU RỬA MẶT|SINK
BÌNH NÓNG LẠNH|WATER HEATER
GIÁ ĐỂ ĐỒ|SHELF
GƯƠNG NHÀ TẮM|VANITY MIRROR
HỘP GIẤY VỆ SINH|TISSUE BOX
CÂY CỌ BỒN CẦU|TOILET BRUSH
NƯỚC TẨY RỬA|CLEANER
SỌT ĐỰNG ĐỒ|LAUNDRY HAMPER
MÁY GIẶT|WASHER
MÁY SẤY QUẦN ÁO|DRYER
GIÀN PHƠI|CLOTHES RACK
KẸP PHƠI ĐỒ|CLOTHESPEG
CẦU LÀ|IRONING BOARD
NƯỚC GIẶT|LIQUID DETERGENT
NƯỚC XẢ VẢI|FABRIC SOFTENER
CÂY CHỔI QUÉT|BROOM
HỐT RÁC|DUSTPAN
CÂY LAU NHÀ|MOP
THÙNG NƯỚC|WATER PAIL
MÁY HÚT BỤI|VACUUM
ROBOT HÚT BỤI|ROBOT VACUUM
KHĂN LAU BÀN|RAG
BÚI RỬA BÁT|SPONGE
CỬA RA VÀO|FRONT DOOR
CỬA CUỐN|ROLLER SHUTTER
CỬA KÍNH|GLASS DOOR
CỔNG SẮT|IRON GATE
KHÓA CỬA|DOOR LOCK
CHUÔNG CỬA|DOORBELL
MẮT THẦN|PEEPHOLE
HÒM THƯ|MAILBOX
SỐ NHÀ|HOUSE NUMBER
BẬC TAM CẤP|PORCH STEPS
LAN CAN|RAILING
BAN CÔNG|BALCONY
SÂN THƯỢNG|ROOFTOP TERRACE
MÁI HIÊN|CANOPY
MÁI TÔN|CORRUGATED ROOF
MÁI NGÓI|TILE ROOF
ỐNG THOÁT NƯỚC|GUTTER
BỒN NƯỚC MÁI|ROOF WATER TANK
THÁP CHỐNG SÉT|LIGHTNING CONDUCTOR
TƯỜNG GẠCH|BRICK WALL
TƯỜNG RÀO|BOUNDARY WALL
CỘT NHÀ|PILLAR
TRẦN NHÀ|CEILING
SÀN GỖ|HARDWOOD FLOOR
GẠCH LÁT NỀN|FLOOR TILE
CẦU THANG BỘ|STAIRCASE
TAY VỊN CẦU THANG|HANDRAIL
THANG MÁY|ELEVATOR
HẦM RƯỢU|WINE CELLAR
GÁC XÉP|MEZZANINE
PHÒNG GÁC MÁI|ATTIC
GARA Ô TÔ|GARAGE
KHO CHỨA ĐỒ|STORAGE ROOM
LỐI ĐI|WALKWAY
SÂN VƯỜN|BACKYARD
BỂ BƠI GIA ĐÌNH|HOME POOL
XÍCH ĐU GỖ|WOODEN SWING
BỘ BÀN GHẾ ĐÁ|STONE BENCH SET
CHÒI NGHỈ|GAZEBO
TIỂU CẢNH NƯỚC|WATER FEATURE
ĐÈN SÂN VƯỜN|GARDEN LIGHT
HÀNG RÀO GỖ|PICKET FENCE
LỐI ĐI RẢI SỎI|GRAVEL PATH
XE MÁY|MOTORBIKE
XE TAY GA|MOPED
XE ĐẠP ĐIỆN|E-BIKE
XE ĐẠP ĐỊA HÌNH|MOUNTAIN BIKE
XE HƠI CON|SEDAN
XE BÁN TẢI|PICKUP
XE SUV|SUV
XE MUI TRẦN|CONVERTIBLE
XE CẤP CỨU|AMBULANCE
XE CỨU HỎA|FIRE ENGINE
XE CẢNH SÁT|PATROL CAR
XE TAXI|CAB
XE BUÝT HAI TẦNG|DOUBLE DECKER
XE ĐÒ|COACH BUS
XE TẢI THÙNG|BOX TRUCK
XE CONTAINER|SEMI TRUCK
XE BỒN NƯỚC|WATER TANKER
XE QUÉT RÁC|STREET SWEEPER
XE CẨU|MOBILE CRANE
XE ỦI ĐẤT|BULLDOZER
XE MÁY XÚC|DIGGER
XE LU ĐƯỜNG|ROAD ROLLER
XE TRỘN VỮA|CONCRETE TRUCK
XE NÂNG HÀNG|FORKLIFT
MÁY BAY DÂN DỤNG|PASSENGER PLANE
MÁY BAY TRỰC THĂNG|CHOPPER
MÁY BAY PHẢN LỰC|JET
MÁY BAY QUÂN SỰ|FIGHTER JET
TÀU ĐIỆN CAO TỐC|BULLET TRAIN
TÀU ĐIỆN NGẦM|METRO
XE LỬA HƠI NƯỚC|STEAM TRAIN
THUYỀN BUỒM|SAILBOAT
THUYỀN ĐUA|ROWING BOAT
CANÔ CAO TỐC|SPEEDBOAT
TÀU THỦY CHỞ KHÁCH|FERRY SHIP
TÀU CHỞ DẦU|OIL TANKER
TÀU CONTAINER|CARGO SHIP
TÀU NGẦM HẠT NHÂN|NUCLEAR SUB
TÀU PHÁ BĂNG|ICEBREAKER
XUỒNG CỨU SINH|LIFEBOAT
BÈ CỨU SINH|LIFERAFT
THUYỀN THÚNG|CORACLE BOAT
BẢN ĐỒ THẾ GIỚI|WORLD MAP
QUẢ ĐỊA CẦU|DESK GLOBE
KÍNH HIỂN VI|LAB MICROSCOPE
ỐNG NHÒM DU LỊCH|FIELD BINOCULARS
LA BÀN BỎ TÚI|POCKET COMPASS
THƯỚC DÂY|TAPE MEASURE
CÂN TIỂU LY|JEWELRY SCALE
BỘ ĐÀM CẦM TAY|WALKIE TALKIE
CÒI BÁO ĐỘNG|SIREN ALARM
LOA PHÁT THANH|MEGAPHONE
CHUÔNG ĐỒNG|TEMPLE BELL
MÁY GHI ÂM|VOICE RECORDER
MÁY ĐO ĐỘ ẨM|HYGROMETER
MÁY ĐO HUYẾT ÁP|SPHYGMOMANOMETER
ĐÈN LASER|LASER POINTER
ĐỒNG HỒ CÁT|HOURGLASS
ĐỒNG HỒ BẤM GIỜ|STOPWATCH
ĐỒNG HỒ QUẢ LẮC|PENDULUM CLOCK
ĐỒNG HỒ NƯỚC|WATER METER
CÔNG TƠ ĐIỆN|WATT-HOUR METER
BÌNH CHỮA CHÁY|FIRE EXTINGUISHER
BÚA THOÁT HIỂM|SAFETY HAMMER
ÁO CHỐNG ĐẠN|BULLETPROOF VEST
KHIÊN CHỐNG BẠO ĐỘNG|RIOT SHIELD
GẬY CAO SU|BATON
CÒNG SỐ 8|STEEL HANDCUFFS
SÚNG BẮN ĐIỆN|TASER
MẶT NẠ CHỐNG KHÓI|SMOKE HOOD
THANG DÂY CỨU HỘ|ROPE LADDER
ĐÈN CHỚP CỨU NẠN|STROBE BEACON
CỜ HIỆU HẢI QUÂN|NAVAL SIGNAL FLAG
PHÁO BÁO HIỆU|DISTRESS FLARE
PHA ĐÈN BIỂN|LIGHTHOUSE BEACON
TRẠM THỜI TIẾT|WEATHER STATION
PHAO ĐO GIÓ|WINDSOCK
CHUÔNG GIÓ|WIND CHIMES
CON LẮC NEWTON|NEWTONS CRADLE
KÍNH VẠN HOA|KALEIDOSCOPE
HỘP ẢO THUẬT|MAGIC BOX
QUẢ VẢI|LYCHEE
QUẢ NHÃN|LONGAN
QUẢ CHÔM CHÔM|RAMBUTAN
MĂNG CỤT|MANGOSTEEN
QUẢ MÃNG CẦU|CUSTARD APPLE
QUẢ HỒNG|PERSIMMON
QUẢ QUẤT|KUMQUAT
QUẢ KHẾ|STARFRUIT
QUẢ ME|TAMARIND
CỦ SEN|LOTUS ROOT
CỦ NGHỆ|TURMERIC
CỦ GỪNG|GINGER
CỦ RIỀNG|GALANGAL
CỦ SẢ|LEMONGRASS
ỚT CHỈ THIÊN|HOT CHILI
LÁ CHUỐI|BANANA LEAF
LÁ DONG|DONG LEAF
LÁ DỨA|PANDAN LEAF
HÚNG CHUYÊN|SWEET BASIL
HÀNH TÂY|YELLOW ONION
HÀNH TÍM|SHALLOT
HÀNH LÁ|GREEN ONION
HẸ|CHIVES
NGÒ RÍ|CORIANDER
THÌ LÀ|DILL
RAU DIẾP|LETTUCE
CẢI BẮP|CABBAGE
CẢI THẢO|NAPA CABBAGE
CẢI XOĂN|KALE
BÍ XANH|WINTER MELON
MƯỚP ĐẮNG|BITTER GOURD
BẦU DÀI|CALABASH
ĐẬU BẮP|OKRA
ĐẬU CÔ VE|GREEN BEANS
ĐẬU HÀ LAN|PEAS
HẠT BẮP|CORN KERNEL
KHOAI MÔN|TARO
KHOAI MÌ|CASSAVA
CỦ DỀN|BEETROOT
SU HÀO|KOHLRABI
BÔNG ATISO|ARTICHOKE
NẤM RƠM|STRAW MUSHROOM
NẤM HƯƠNG|SHIITAKE
NẤM LINH CHI|REISHI
NẤM KIM CHÂM|ENOKI
NẤM ĐÙI GÀ|KING OYSTER
MỘC NHĨ|WOOD EAR
HẠT É|BASIL SEED
HẠT CHIA|CHIA SEED
MỦ TRÔM|GUM KARAYA
RONG SỤN|SEA MOSS
HẠT SEN|LOTUS SEED
TÁO ĐỎ|JUJUBE
KỶ TỬ|GOJI BERRY
LONG NHÃN|DRIED LONGAN
Ý DĨ|COIX SEED
ĐẬU NGỰ|LIMA BEAN
ĐẬU TRẮNG|WHITE BEAN
VỪNG ĐEN|BLACK SESAME
VỪNG TRẮNG|WHITE SESAME
GẠO NẾP|STICKY RICE
GẠO LỨT|BROWN RICE
YẾN MẠCH|OATS
BỘT MÌ|FLOUR
BỘT NĂNG|TAPIOCA STARCH
BỘT GẠO|RICE FLOUR
BỘT CHIÊN XÙ|PANKO
MEN NỞ|YEAST
DẦU MÈ|SESAME OIL
DẦU HÀO|OYSTER SAUCE
NƯỚC TƯƠNG|SOY SAUCE
MẮM NÊM|ANCHOVY SAUCE
MẮM RUỐC|FERMENTED SHRIMP PASTE
GIẤM TÁO|APPLE CIDER VINEGAR
MUỐI HỘT|SEA SALT
MUỐI HỒNG|PINK SALT
ĐƯỜNG PHÈN|ROCK SUGAR
ĐƯỜNG THỐT NỐT|PALM SUGAR
MẬT MÍA|MOLASSES
SỮA ĐẬU NÀNH|SOYMILK
SỮA HẠNH NHÂN|ALMOND MILK
SỮA DỪA|COCONUT MILK
SỮA CHUA UỐNG|DRINKABLE YOGURT
TRÀ THẢO MỘC|HERBAL TEA
TRÀ ĐEN|BLACK TEA
TRÀ DƯỠNG NHAN|BEAUTY TEA
NƯỚC ĐẬU ĐEN|BLACK BEAN DRINK
NƯỚC RAU MÁ|PENNYWORT DRINK
RƯỢU NẾP CẨM|PURPLE RICE WINE
RƯỢU CẦN|JAR WINE
BIA THỦ CÔNG|CRAFT BEER
RƯỢU GẠO|RICE LIQUOR
RƯỢU MẬT ONG|MEAD
NƯỚC TĂNG LỰC|ENERGY DRINK
TRÀ KOMBUCHA|KOMBUCHA
NƯỚC ÉP LỰU|POMEGRANATE JUICE
CÀ PHÊ PHA PHIN|DRIP COFFEE
CÀ PHÊ TRỨNG|EGG COFFEE
CÀ PHÊ MUỐI|SALT COFFEE
BẠC XỈU|WHITE COFFEE
CACAO NÓNG|HOT COCOA
TRÀ MATCHA|MATCHA LATTE
BÁNH BÒ THỐT NỐT|PALM CAKE
BÁNH IN|MOLDED CAKE
BÁNH CỐM|GREEN RICE CAKE
KẸO MÈ XỬNG|SESAME CANDY
KẸO DỒI|PEANUT ROLL CANDY
BÁNH PHU THÊ|WEDDING RICE CAKE
BÁNH GAI|BLACK LEAF CAKE
BÁNH TẺ|PLAIN RICE CAKE
BÁNH GIO|ASH WATER CAKE
BÁNH NẾP|GLUTINOUS DUMPLING
BÁNH KHỌT|MINI PANCAKE
BÁNH BÈO|WATER FERN CAKE
BÁNH CĂN|CAN CAKE
BÁNH ĐÚC|SAVORY RICE FLOUR CAKE
BÁNH QUY BƠ|SHORTBREAD
BÁNH GẠO|RICE CRACKER
SỮA CHUA NẾP CẨM|BLACK RICE YOGURT
BIA LẠNH|COLD BEER
NƯỚC MƠ|APRICOT JUICE
NƯỚC SẤU|DRACONTOMELON JUICE
`);

export const MOST_LIKELY = pairs(`
Ai có khả năng quay lại với người yêu cũ nhất?|Who is most likely to get back with an ex?
Ai dễ ngủ quên trong ngày quan trọng nhất?|Who is most likely to oversleep on an important day?
Ai có khả năng trở thành người nổi tiếng nhất?|Who is most likely to become famous?
Ai sẽ sống sót lâu nhất trong phim zombie?|Who would survive longest in a zombie movie?
Ai có khả năng tiêu hết lương trong một ngày?|Who is most likely to spend a whole salary in one day?
Ai dễ cười vào lúc không nên cười nhất?|Who is most likely to laugh at the worst moment?
Ai sẽ bí mật lên kế hoạch cho chuyến đi bất ngờ?|Who would secretly plan a surprise trip?
Ai có khả năng nhắn tin nhầm người nhất?|Who is most likely to text the wrong person?
Ai sẽ quên sinh nhật của chính mình?|Who is most likely to forget their own birthday?
Ai có thể ăn đồ cay giỏi nhất?|Who could handle the spiciest food?
Ai dễ trở thành triệu phú nhất?|Who is most likely to become a millionaire?
Ai sẽ nhận nuôi nhiều thú cưng nhất?|Who is most likely to adopt the most pets?
Ai có khả năng đi lạc dù đang dùng bản đồ?|Who is most likely to get lost while using a map?
Ai sẽ hát karaoke sung nhất?|Who would sing karaoke with the most confidence?
Ai có khả năng thức trắng để xem hết một bộ phim?|Who is most likely to stay up all night binge-watching?
Ai dễ mua món đồ kỳ lạ nhất trên mạng?|Who is most likely to buy the strangest thing online?
Ai sẽ nấu bữa tối ngon nhất cho cả nhóm?|Who would cook the best dinner for everyone?
Ai có khả năng đổi nghề bất ngờ nhất?|Who is most likely to suddenly change careers?
Ai dễ khóc nhất khi xem phim hoạt hình?|Who is most likely to cry during an animated movie?
Ai sẽ thắng một cuộc thi nhảy ngẫu hứng?|Who would win an improvised dance contest?
Ai có khả năng mang quá nhiều đồ khi đi du lịch?|Who is most likely to overpack for a trip?
Ai dễ làm bạn với người lạ nhất?|Who is most likely to befriend a stranger?
Ai sẽ giữ bí mật tốt nhất?|Who would keep a secret best?
Ai có khả năng quên mình để điện thoại ở đâu?|Who is most likely to forget where their phone is?
Ai sẽ dậy sớm nhất trong kỳ nghỉ?|Who would wake up earliest on vacation?
Ai có khả năng mở quán cà phê nhất?|Who is most likely to open a cafe?
Ai sẽ thắng trò đoán chữ?|Who would win a word guessing game?
Ai dễ đặt biệt danh cho mọi người nhất?|Who is most likely to give everyone nicknames?
Ai có khả năng ngủ gật trên xe nhất?|Who is most likely to fall asleep during a ride?
Ai sẽ trở thành trưởng nhóm tự nhiên nhất?|Who would naturally become the group leader?
Ai dễ cười vì chính câu chuyện của mình nhất?|Who is most likely to laugh at their own story?
Ai sẽ thử một môn thể thao mạo hiểm nhất?|Who is most likely to try an extreme sport?
Ai có khả năng nhớ lời bài hát tốt nhất?|Who is most likely to remember every lyric?
Ai sẽ chiến thắng trong một chương trình sinh tồn?|Who would win a survival reality show?
Ai dễ gửi meme lúc nửa đêm nhất?|Who is most likely to send memes at midnight?
Ai có khả năng viết sách nhất?|Who is most likely to write a book?
Ai sẽ tổ chức bữa tiệc tuyệt nhất?|Who would organize the best party?
Ai dễ nói chuyện với thú cưng nhất?|Who is most likely to talk to pets?
Ai có khả năng học ngoại ngữ nhanh nhất?|Who is most likely to learn a language fastest?
Ai sẽ mang đồ ăn vặt đến mọi cuộc gặp?|Who would bring snacks to every gathering?
Ai dễ thay đổi kiểu tóc đột ngột nhất?|Who is most likely to suddenly change hairstyle?
Ai có khả năng tham gia gameshow nhất?|Who is most likely to join a game show?
Ai sẽ cười lâu nhất vì một câu đùa dở?|Who would laugh longest at a bad joke?
Ai dễ quên trả lời tin nhắn nhất?|Who is most likely to forget to reply?
Ai có khả năng tự làm đồ nội thất nhất?|Who is most likely to build their own furniture?
Ai sẽ chụp nhiều ảnh nhất trong chuyến đi?|Who would take the most photos on a trip?
Ai dễ trở thành streamer nhất?|Who is most likely to become a streamer?
Ai có khả năng đặt vé đi ngay ngày mai?|Who is most likely to book a trip for tomorrow?
Ai sẽ thắng một cuộc tranh luận vui?|Who would win a playful debate?
Ai dễ biến việc nhỏ thành câu chuyện hài nhất?|Who is most likely to turn a small event into a funny story?
Ai có khả năng bị dị ứng với những thứ kỳ lạ nhất?|Who is most likely to have the weirdest allergy?
Ai dễ bị giật mình vì tiếng động nhỏ nhất?|Who is most easily startled by small noises?
Ai sẽ là người đầu tiên rời khỏi bữa tiệc?|Who is most likely to leave the party first?
Ai sẽ ở lại dọn dẹp sau bữa tiệc?|Who would stay behind to clean up after the party?
Ai dễ tin vào những câu chuyện ma nhất?|Who is most likely to believe in ghost stories?
Ai có khả năng sống một mình trên đảo hoang giỏi nhất?|Who could survive best alone on a deserted island?
Ai dễ bị nghiện mua hàng online nhất?|Who is most likely to be addicted to online shopping?
Ai sẽ là người gọi đồ ăn khuya nhiều nhất?|Who is most likely to order late-night food?
Ai có khả năng giữ bình tĩnh giỏi nhất khi khủng hoảng?|Who stays calmest in a crisis?
Ai dễ bị say xe nhất trong nhóm?|Who gets motion sick most easily?
Ai có giọng cười truyền cảm hứng nhất?|Who has the most contagious laugh?
Ai dễ tha thứ cho lỗi lầm của người khác nhất?|Who is most forgiving?
Ai có khả năng làm cháy đồ ăn khi nấu bếp nhất?|Who is most likely to burn food while cooking?
Ai sẽ tiêu nhiều tiền nhất cho sở thích cá nhân?|Who spends the most money on hobbies?
Ai có khả năng nhận ra người quen trên đường nhanh nhất?|Who spots familiar faces first in a crowd?
Ai dễ bị mất đồ cá nhân nhất?|Who is most likely to lose personal belongings?
Ai có tủ quần áo nhiều màu sắc nhất?|Who has the most colorful wardrobe?
Ai sẽ luôn là người đến đúng giờ nhất?|Who is always the most punctual?
Ai luôn có mặt muộn năm phút?|Who is always five minutes late?
Ai có thể nhịn cười giỏi nhất khi chơi trò nhìn nhau?|Who can hold back laughter longest in a staring contest?
Ai dễ bị cảm động trước câu chuyện trên mạng nhất?|Who gets emotional most easily from internet stories?
Ai sẽ thử những món ăn kỳ lạ nhất khi đi du lịch?|Who tries the strangest food when traveling?
Ai có khả năng sửa chữa đồ đạc trong nhà khéo nhất?|Who is best at fixing things around the house?
Ai dễ thay đổi ý định vào phút chót nhất?|Who is most likely to change their mind at the last minute?
Ai sẽ là người kể chuyện cuốn hút nhất đêm khuya?|Who tells the best late-night stories?
Ai có gu âm nhạc độc lạ nhất?|Who has the most eclectic taste in music?
Ai dễ bị thu hút bởi những món đồ lấp lánh nhất?|Who is most attracted to shiny things?
Ai sẽ là người đầu tiên thử trò chơi mạo hiểm?|Who is the first to volunteer for a thrill ride?
Ai có khả năng bắt chước giọng người khác giỏi nhất?|Who does the best impressions of other people?
Ai dễ xúc động khi xem phim tình cảm nhất?|Who cries easiest during romantic movies?
Ai có khả năng nhịn ăn đồ ngọt lâu nhất?|Who can resist sweets the longest?
Ai sẽ là người đầu tiên bắt chuyện với người mới?|Who breaks the ice with newcomers first?
Ai có phòng ngủ ngăn nắp và sạch sẽ nhất?|Who has the tidiest bedroom?
Ai dễ bị thu hút bởi thú cưng ngoài đường nhất?|Who stops to pet every stray animal?
Ai có trí nhớ về những chi tiết nhỏ tốt nhất?|Who remembers the smallest details best?
Ai sẽ là người đầu tiên nhảy vào hồ bơi?|Who jumps into the pool first?
Ai có thể ăn cùng một món cả tuần mà không chán?|Who could eat the same meal all week without getting bored?
Ai dễ bị phân tâm bởi điện thoại khi đang trò chuyện?|Who gets distracted by their phone most during conversations?
Ai sẽ là người lập kế hoạch tỉ mỉ nhất cho chuyến đi?|Who creates the most detailed travel itinerary?
Ai có khả năng thương lượng giảm giá giỏi nhất?|Who is the best bargainer?
Ai dễ bị giấu đồ mà không hề hay biết nhất?|Who is most clueless when someone hides their stuff?
Ai sẽ là người chọn bài hát hay nhất trên xe?|Who controls the road trip playlist best?
Ai có thể thức dậy sớm mà không cần chuông báo thức?|Who can wake up early without an alarm?
Ai dễ cười ngả nghiêng vì trò đùa nhạt nhẽo nhất?|Who laughs hardest at dad jokes?
Ai sẽ là người đầu tiên nhận ra khi ai đó có kiểu tóc mới?|Who notices a new haircut first?
Ai có khả năng học một điệu nhảy mới nhanh nhất?|Who learns dance moves the fastest?
Ai dễ bị lạc giọng khi nói chuyện trước đám đông nhất?|Who is most likely to get voice cracks when speaking publicly?
Ai sẽ là người mang nhiều đồ ăn vặt nhất đi xem phim?|Who sneaks the most snacks into the movie theater?
Ai có thể giải rubik hoặc câu đố trí tuệ nhanh nhất?|Who solves puzzles or Rubik's cubes fastest?
Ai dễ bị dụ mua những món hàng khuyến mãi nhất?|Who is most easily tempted by sale promotions?
Ai sẽ là người đầu tiên đề xuất đi hát karaoke?|Who suggests karaoke night first?
Ai có khả năng giữ bình tĩnh khi chơi game đối kháng nhất?|Who stays calmest playing competitive games?
Ai dễ bị đỏ mặt khi được khen ngợi nhất?|Who blushes easiest when complimented?
Ai sẽ là người chụp ảnh selfie đẹp nhất nhóm?|Who takes the best selfies in the group?
Ai có trái tim ấm áp và hay giúp đỡ bạn bè nhất?|Who has the warmest heart and always helps friends?
`);

export const JUST_ONE_WORDS = pairs(`
Mặt trời|Sun
Mặt trăng|Moon
Ngôi sao|Star
Trái đất|Earth
Cầu vồng|Rainbow
Sấm sét|Thunder
Cơn mưa|Rain
Bông tuyết|Snowflake
Đám mây|Cloud
Núi lửa|Volcano
Đại dương|Ocean
Bãi biển|Beach
Hòn đảo|Island
Rừng rậm|Jungle
Sa mạc|Desert
Thác nước|Waterfall
Ngọn núi|Mountain
Hang động|Cave
Con sông|River
Hồ nước|Lake
Kim cương|Diamond
Vàng bạc|Gold
Kho báu|Treasure
Lâu đài|Castle
Tòa tháp|Tower
Cung điện|Palace
Cây cầu|Bridge
Ngọn hải đăng|Lighthouse
Cối xay gió|Windmill
Kim tự tháp|Pyramid
Tên lửa|Rocket
Máy bay|Airplane
Trực thăng|Helicopter
Tàu hỏa|Train
Tàu ngầm|Submarine
Thuyền buồm|Sailboat
Xe đạp|Bicycle
Xe máy|Motorcycle
Xe ô tô|Car
Khinh khí cầu|Hot air balloon
Phi hành gia|Astronaut
Thám tử|Detective
Bác sĩ|Doctor
Y tá|Nurse
Cảnh sát|Police
Lính cứu hỏa|Firefighter
Phù thủy|Wizard
Hiệp sĩ|Knight
Nữ hoàng|Queen
Quốc vương|King
Hoàng tử|Prince
Công chúa|Princess
Siêu nhân|Superhero
Người tuyết|Snowman
Robot|Robot
Hải tặc|Pirate
Ninja|Ninja
Samurai|Samurai
Khủng long|Dinosaur
Con rồng|Dragon
Kỳ lân|Unicorn
Người cá|Mermaid
Con voi|Elephant
Hươu cao cổ|Giraffe
Sư tử|Lion
Con hổ|Tiger
Gấu trúc|Panda
Chim cánh cụt|Penguin
Cá mập|Shark
Cá heo|Dolphin
Cá voi|Whale
Bạch tuộc|Octopus
Đại bàng|Eagle
Cú mèo|Owl
Con công|Peacock
Con vẹt|Parrot
Con ong|Bee
Bướm hoa|Butterfly
Con nhện|Spider
Con rùa|Turtle
Con thỏ|Rabbit
Con khỉ|Monkey
Con sóc|Squirrel
Con nhím|Hedgehog
Con chó|Dog
Con mèo|Cat
Con ngựa|Horse
Con cừu|Sheep
Con bò|Cow
Con lợn|Pig
Pizza|Pizza
Hamburger|Burger
Bánh mì|Bread
Bánh ngọt|Cake
Kem ốc quế|Ice cream
Socola|Chocolate
Kẹo ngọt|Candy
Cà phê|Coffee
Trà sữa|Boba tea
Mật ong|Honey
Quả táo|Apple
Quả chuối|Banana
Quả dưa hấu|Watermelon
Quả dâu tây|Strawberry
Chùm nho|Grapes
Quả dứa|Pineapple
Quả cam|Orange
Quả chanh|Lemon
Củ cà rốt|Carrot
Quả cà chua|Tomato
Bắp ngô|Corn
Cây nấm|Mushroom
Hoa hồng|Rose
Hoa hướng dương|Sunflower
Hoa sen|Lotus
Cây dừa|Palm tree
Xương rồng|Cactus
Cây tre|Bamboo
Điện thoại|Phone
Máy tính|Computer
Tivi|Television
Máy ảnh|Camera
Kính râm|Sunglasses
Chiếc ô|Umbrella
Đồng hồ|Clock
Đèn pin|Flashlight
Chìa khóa|Key
Ổ khóa|Lock
Bản đồ|Map
La bàn|Compass
Kính viễn vọng|Telescope
Kính lúp|Magnifying glass
Hộp quà|Gift
Bong bóng|Balloon
Con diều|Kite
Vương miện|Crown
Nhẫn cưới|Ring
Gương soi|Mirror
Cây lược|Comb
Bàn chải|Toothbrush
Khăn tắm|Towel
Bút chì|Pencil
Cục tẩy|Eraser
Quyển sách|Book
Bức thư|Letter
Thùng rác|Trash can
Cây chổi|Broom
Chiếc bàn|Table
Chiếc ghế|Chair
Giường ngủ|Bed
Chiếc gối|Pillow
Chiếc chăn|Blanket
Đôi giày|Shoes
Chiếc mũ|Hat
Áo khoác|Jacket
Quần bò|Jeans
Thắt lưng|Belt
Cà vạt|Necktie
Đàn guitar|Guitar
Đàn piano|Piano
Cái trống|Drum
Kèn trumpet|Trumpet
Micro|Microphone
Quả bóng|Ball
Bể bơi|Pool
Sân vận động|Stadium
Rạp chiếu phim|Cinema
Thư viện|Library
Bệnh viện|Hospital
Trường học|School
Nhà thờ|Church
Ngôi chùa|Pagoda
Sân bay|Airport
Ga tàu|Train station
Công viên|Park
Sở thú|Zoo
Căn bếp|Kitchen
Nhà tắm|Bathroom
Cửa sổ|Window
Cánh cửa|Door
Hàng rào|Fence
Mái nhà|Roof
Ống khói|Chimney
Bức tường|Wall
Cái xô|Bucket
Cái xẻng|Shovel
Cây búa|Hammer
Chiếc đinh|Nail
Cưa gỗ|Saw
Dây thừng|Rope
Cái kéo|Scissors
Dao gọt|Knife
Cái thìa|Spoon
Cái dĩa|Fork
Bát ăn|Bowl
Cái ly|Glass
Bình hoa|Vase
Ngọn nến|Candle
Bóng đèn|Lightbulb
Bật lửa|Lighter
Bao diêm|Matches
Pháo hoa|Fireworks
Quả bom|Bomb
Súng bắn|Gun
Thanh kiếm|Sword
Chiếc khiên|Shield
Cung tên|Bow and arrow
Áo giáp|Armor
Cái còi|Whistle
Chuông đồng|Bell
Huy chương|Medal
Chiếc cúp|Trophy
Giấc mơ|Dream
Ác mộng|Nightmare
Hòa bình|Peace
Tự do|Freedom
Tình yêu|Love
Nụ cười|Smile
Nước mắt|Tears
Phép màu|Miracle
Bí mật|Secret
Kỷ niệm|Memory
Thời gian|Time
Bình minh|Sunrise
Hoàng hôn|Sunset
Bóng tối|Darkness
Ánh sáng|Light
Ngọn lửa|Fire
Băng đá|Ice
Gió bão|Wind
Sóng biển|Wave
Bụi bặm|Dust
Khói sương|Smoke
Bùn đất|Mud
Cát trắng|Sand
Viên đá|Stone
Khúc gỗ|Log
Chiếc lá|Leaf
Cành cây|Branch
Hạt giống|Seed
Quả đào|Peach
Quả mơ|Apricot
Quả ổi|Guava
Quả xoài|Mango
Quả mít|Jackfruit
Sầu riêng|Durian
Chanh leo|Passion fruit
Quả mận|Plum
Quả lê|Pear
Quả dừa|Coconut
Quả gấc|Gac fruit
Quả bưởi|Pomelo
Đu đủ|Papaya
Hạt dẻ|Chestnut
Hạt điều|Cashew
Hạt lạc|Peanut
Củ khoai|Sweet potato
Củ sắn|Cassava
Củ gừng|Ginger
Củ tỏi|Garlic
Hành lá|Scallion
Rau bina|Spinach
Rau ngót|Star gooseberry
Giá đỗ|Bean sprouts
Đậu xanh|Mung bean
Đậu đỏ|Red bean
Đậu đen|Black bean
Đậu nành|Soybean
Cơm trắng|White rice
Xôi xéo|Sticky rice
Cháo gà|Chicken congee
Miến xào|Fried glass noodles
Bún chả|Bun cha
Bún riêu|Crab noodles
Hủ tiếu|Hu tieu
Mì xào|Chow mein
Bánh xèo|Crispy pancake
Bánh khọt|Mini pancake
Bánh cuốn|Rice roll
Bánh bao|Bao bun
Chả giò|Spring roll
Thịt kho|Braised pork
Canh chua|Sour soup
Cá kho|Braised fish
Tôm rim|Caramelized shrimp
Mực xào|Stir-fry squid
Lẩu thái|Thai hot pot
Gà luộc|Boiled chicken
Vịt quay|Roast duck
Xúc xích|Sausage
Thịt xông khói|Bacon
Sườn nướng|Grilled ribs
Trứng chiên|Omelet
Súp bí đỏ|Pumpkin soup
Salad rau|Vegetable salad
Bơ lạt|Butter
Sữa chua|Yogurt
Phô mai|Cheese
Sữa đặc|Condensed milk
Nước dừa|Coconut water
Nước mía|Sugarcane juice
Nước sâm|Herbal drink
Rượu vang|Wine
Bia hơi|Beer
Nước chanh|Lemonade
Sinh tố|Smoothie
Nước khoáng|Mineral water
Trà xanh|Green tea
Ca cao|Cocoa
Bánh quy|Biscuit
Bánh bông lan|Sponge cake
Bánh rán|Donut
Kem chuối|Banana ice cream
Kẹo cao su|Chewing gum
Thạch dừa|Coconut jelly
Bỏng ngô|Popcorn
Mũ len|Beanie
Găng tay|Gloves
Khăn quàng|Scarf
Áo len|Sweater
Áo phao|Puffer jacket
Ủng cao su|Rubber boots
Dép lê|Flip-flops
Giày cao gót|High heels
Kính cận|Eyeglasses
Kính bơi|Swim goggles
Mặt nạ|Mask
Túi xách|Handbag
Cái ví|Wallet
Cặp sách|Schoolbag
Hộp bút|Pencil case
Vở ghi|Notebook
Thước kẻ|Ruler
Compa|Compass tool
Kéo cắt giấy|Paper scissors
Băng dính|Tape
Hồ dán|Glue stick
Màu sáp|Crayons
Màu nước|Watercolors
Bảng vẽ|Drawing board
Giá vẽ|Easel
Máy in|Printer
Bàn phím|Keyboard
Chuột máy|Computer mouse
Loa nghe|Speaker
Tai nghe|Earphones
Cáp sạc|Charge cable
Cục sạc|Charger
Pin sạc|Battery
USB|USB stick
Thẻ nhớ|Memory card
Đĩa game|Game disc
Băng cassette|Cassette tape
Máy sấy tóc|Hairdryer
Bàn ủi|Clothes iron
Máy hút bụi|Vacuum cleaner
Quạt trần|Ceiling fan
Máy lạnh|Air conditioner
Máy giặt|Washing machine
Tủ lạnh|Refrigerator
Bếp ga|Gas stove
Lò nướng|Oven
Nồi chiên|Air fryer
Máy xay|Blender
Ấm đun|Kettle
Phích nước|Thermos
Chảo chống dính|Nonstick pan
Thớt gỗ|Cutting board
Đũa ăn|Chopsticks
Muỗng múc|Ladle
Dao bếp|Chef knife
Rổ nhựa|Plastic colander
Chậu rửa|Sink basin
Vòi nước|Water tap
Bồn tắm|Bathtub
Vòi hoa sen|Shower head
Gương nhà tắm|Bathroom mirror
Giá treo|Towel rack
Thảm chân|Doormat
Rèm che|Curtain
Đệm ngủ|Mattress
Ga giường|Bed sheet
Mùng chống muỗi|Mosquito net
Gối ôm|Body pillow
Đèn ngủ|Bedside lamp
Tủ quần áo|Wardrobe
Kệ sách|Bookshelf
Bàn trang điểm|Vanity table
Ghế bành|Armchair
Sofa|Sofa couch
Bàn trà|Coffee table
Tủ giày|Shoe rack
Cửa kính|Glass door
Khóa vân tay|Smart lock
Chuông cửa|Door chime
Hòm thư|Letterbox
Cột cờ|Flagpole
Lá cờ|Flag
Cột đèn|Lamp post
Cột điện|Utility pole
Dây điện|Electric wire
Biển quảng cáo|Billboard
Vạch qua đường|Zebra crossing
Gờ giảm tốc|Speed bump
Thùng thư|Postbox
Cây cảnh|Bonsai
Chậu gốm|Ceramic pot
Hòn non bộ|Rockery landscape
Hồ cá koi|Koi pond
Chuồng chim|Aviary
Nhà cún|Dog kennel
Cát mèo|Cat litter
Vòng cổ thú cưng|Pet collar
Dây dắt chó|Dog leash
Vợt tennis|Tennis racket
Vợt cầu lông|Badminton racket
Quả cầu lông|Shuttlecock
Bóng rổ|Basketball
Bóng đá|Soccer ball
Bóng chuyền|Volleyball
Bóng chày|Baseball
Gậy đánh bóng|Baseball bat
Bóng bàn|Ping pong ball
Bàn bi-a|Pool table
Gậy bi-a|Billiard cue
Bi da|Pool ball
Găng boxing|Boxing glove
Bao cát|Punching bag
Ván trượt|Skateboard
Giày trượt|Roller skate
Xe scooter|Kick scooter
Ván chèo|Paddleboard
Cần câu|Fishing pole
Lưỡi câu|Fishhook
Mồi giả|Lure
Lưới bẫy|Catch net
Kính hiển vi|Microscope
Ống nghiệm|Test tube
Bình hóa chất|Beaker flask
Cân tiểu ly|Precision scale
Nhiệt kế|Thermometer
Máy trợ thính|Hearing aid
Kính áp tròng|Contact lens
Băng cá nhân|Adhesive bandage
Kim tiêm|Syringe needle
Thuốc viên|Medicine pill
Chai cồn|Rubbing alcohol
Bông gòn|Cotton ball
Cáng cứu thương|Stretcher
Bánh xe|Tire wheel
Vô lăng|Steering wheel
Gương chiếu hậu|Rearview mirror
Cần gạt nước|Windshield wiper
Đèn pha xe|Headlight
Còi ô tô|Car horn
Biển số xe|License plate
Vé xe buýt|Bus ticket
Thẻ tàu điện|Metro pass
Vé xem xiếc|Circus ticket
Bỏng ngô rạp|Cinema popcorn
Kính 3D|3D glasses
Máy chiếu phim|Film projector
Màn hình lớn|Giant screen
Sân khấu ca nhạc|Concert stage
Dàn hợp xướng|Choir chorus
Nhạc trưởng|Music conductor
Vũ công bale|Ballet dancer
Trang phục dạ hội|Ball gown
Mặt nạ dạ hội|Masquerade mask
Đèn lồng đỏ|Red lantern
Cây nêu|New Year bamboo pole
Câu đối đỏ|Red couplets
Mâm ngũ quả|Five-fruit tray
Nén hương|Incense stick
Bát quái|Bagua mirror
Chuông gió|Wind chime
Bùa hộ mệnh|Lucky talisman
Mèo thần tài|Maneki-neko cat
Cóc ngậm tiền|Money frog toad
Cây phát tài|Lucky bamboo
Hoa mai|Apricot blossom
Hoa đào|Peach blossom
Hoa cúc|Daisy
Cây mía|Sugarcane
Cây lúa|Rice plant
Cây ngô|Corn plant
Quả cóc|Ambarella
Quả me|Tamarind
Hạt dẻ cười|Pistachio
Hạt hạnh nhân|Almond
Mì cay|Spicy noodles
Thịt nướng|Grilled meat
Bò bít tết|Steak
Chè bưởi|Pomelo sweet soup
Xôi gấc|Red sticky rice
Bánh su kem|Cream puff
Bia tươi|Draft beer
Rượu champagne|Champagne
Khăn rằn|Checkered scarf
Nón lá|Conical hat
Áo bà ba|Traditional shirt
Áo dài|Long dress
Dép tổ ong|Honeycomb slippers
Cái chăn|Warm blanket
Đồng hồ cát|Hourglass
Cột thu lôi|Lightning rod
Két sắt|Safe box
Cái kìm|Pliers
Thước dây|Tape measure
Xe cút kít|Wheelbarrow
Cái thang|Step ladder
Khóa số|Combination lock
`);
