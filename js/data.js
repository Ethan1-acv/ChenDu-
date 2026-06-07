/* ========== DATA LAYER ========== */

const CATEGORIES = [
  '全部','火锅','串串','烧烤','面食','粉面','小吃','蹄花','肥肠',
  '兔头','川菜','钵钵鸡','烤鸭','甜品','冰粉','抄手','锅盔','冒菜'
];

// ---- Base 99 shops (data from thesis acknowledgment) ----
const BASE_SHOPS = [
  {id:1,name:'梅记兔头',cat:'小吃',rec:'兔头、兔腿、兔肚',addr:'西北桥',lat:30.690,lng:104.055,tags:['老店','苍蝇馆子','成都特色']},
  {id:2,name:'翠孃孃老火锅',cat:'火锅',rec:'现切嫩牛肉、番茄嫩肉片、耙蹄花',addr:'春熙路',lat:30.657,lng:104.081,tags:['老火锅','排队王']},
  {id:3,name:'贺记蛋烘糕',cat:'小吃',rec:'奶油肉松、麻辣牛肉、芝麻糖',addr:'文庙西街',lat:30.652,lng:104.048,tags:['蛋烘糕','经典']},
  {id:4,name:'芙蓉蹄花',cat:'蹄花',rec:'招牌蹄花汤、凉拌猪头肉',addr:'犀浦',lat:30.758,lng:103.976,tags:['蹄花','老店']},
  {id:5,name:'邓烤鸭',cat:'烤鸭',rec:'冒烤鸭、鸭肠、豆瓣鱼',addr:'蜀营街',lat:30.675,lng:104.032,tags:['烤鸭','川菜']},
  {id:6,name:'龙森园火锅',cat:'火锅',rec:'毛肚、九尺鲜鹅肠、黄喉',addr:'琴台路',lat:30.663,lng:104.045,tags:['火锅','老字号']},
  {id:7,name:'晓靖轩烧烤',cat:'烧烤',rec:'烤鳝鱼、蒜香大排、鸡翅',addr:'沙河风情',lat:30.662,lng:104.112,tags:['烧烤','夜宵']},
  {id:8,name:'鹏鹏妈老火锅',cat:'火锅',rec:'辣卤肥肠、卤牛肉、卤猪蹄',addr:'宽窄巷子',lat:30.670,lng:104.053,tags:['火锅','卤味']},
  {id:9,name:'肖家河家常面',cat:'面食',rec:'红油脆绍面、红油素椒面',addr:'肖家河北街',lat:30.626,lng:104.035,tags:['面食','老店']},
  {id:10,name:'罗记甜不辣',cat:'小吃',rec:'土豆、藕片、年糕、里脊',addr:'黄金洲公寓',lat:30.660,lng:104.060,tags:['甜不辣','炸物']},
  {id:11,name:'杨师傅糖油果子',cat:'小吃',rec:'糖油果子',addr:'吉祥街',lat:30.671,lng:104.050,tags:['糖油果子','小吃']},
  {id:12,name:'曹氏肥肠',cat:'肥肠',rec:'红烧肥肠、粉蒸肥肠',addr:'红牌楼',lat:30.621,lng:104.016,tags:['肥肠','老店']},
  {id:13,name:'青石桥老瓦房肥肠粉',cat:'粉面',rec:'招牌肥肠粉+冒节子、牛肉锅盔',addr:'青石桥',lat:30.653,lng:104.080,tags:['肥肠粉','老字号']},
  {id:14,name:'胡记串串',cat:'串串',rec:'霸王排骨、水上漂牛肉、小郡肝',addr:'星辉店',lat:30.680,lng:104.091,tags:['串串','排队王']},
  {id:15,name:'孔干饭',cat:'川菜',rec:'土豆/腊肉孔干饭、孔家半边鱼',addr:'文殊院',lat:30.676,lng:104.065,tags:['川菜','老成都']},
  {id:16,name:'油篓街素椒杂酱面',cat:'面食',rec:'素椒杂酱面、红油水饺',addr:'油篓街',lat:30.662,lng:104.076,tags:['面食','老店']},
  {id:17,name:'皇城坝牛肉馆',cat:'川菜',rec:'粉蒸牛肉、皇城肺片',addr:'三桂前街',lat:30.660,lng:104.067,tags:['牛肉','川菜']},
  {id:18,name:'岳富贵老火锅',cat:'火锅',rec:'红烧鸡爪、红烧牛肉、红烧猪蹄',addr:'春熙路',lat:30.655,lng:104.080,tags:['火锅','红烧']},
  {id:19,name:'钢管厂小郡肝串串',cat:'串串',rec:'小郡肝、牛肉、鲜毛肚',addr:'新华公园',lat:30.655,lng:104.102,tags:['串串','小郡肝']},
  {id:20,name:'广东石磨肠粉',cat:'粉面',rec:'鲜虾肠粉、土猪肉蛋肠',addr:'祥和里',lat:30.659,lng:104.093,tags:['肠粉','早餐']},
  {id:21,name:'奇味甜不辣',cat:'小吃',rec:'炸米凉粉、土豆、小香肠',addr:'水碾河',lat:30.652,lng:104.090,tags:['甜不辣','炸物']},
  {id:22,name:'鄢知味冒菜',cat:'冒菜',rec:'乌鱼片、招牌牛肉、鲜猪肝',addr:'建设路八二小区',lat:30.665,lng:104.105,tags:['冒菜','建设路']},
  {id:23,name:'结子串串香',cat:'串串',rec:'郡肝、牛肉、结子、掌中宝',addr:'万象城',lat:30.648,lng:104.115,tags:['串串','万象城']},
  {id:24,name:'甘记肥肠粉',cat:'粉面',rec:'肥肠粉、牛肉锅盔、冰粉',addr:'马鞍北路',lat:30.683,lng:104.065,tags:['肥肠粉','老店']},
  {id:25,name:'桃园酒家',cat:'川菜',rec:'豆瓣鱼、宫保鸡丁、藕汤排骨',addr:'九里堤',lat:30.695,lng:104.043,tags:['川菜','聚餐']},
  {id:26,name:'王记特色锅盔',cat:'锅盔',rec:'鲜肉锅盔、牛肉锅盔、红糖锅盔',addr:'马鞍南路',lat:30.681,lng:104.062,tags:['锅盔','小吃']},
  {id:27,name:'炳林牛肉1986年',cat:'川菜',rec:'粉蒸牛肉、豆花牛肉',addr:'茶店子',lat:30.703,lng:104.008,tags:['牛肉','老店']},
  {id:28,name:'中和裴氏蹄花',cat:'蹄花',rec:'海带炖蹄花、卤肥肠、甜水面',addr:'府河路',lat:30.610,lng:104.079,tags:['蹄花','中和']},
  {id:29,name:'川香小厨',cat:'川菜',rec:'鲜锅兔、尖椒鸡、火爆肥肠',addr:'高新',lat:30.582,lng:104.065,tags:['川菜','高新']},
  {id:30,name:'鑫悦来饭店',cat:'川菜',rec:'肝腰合炒、酸椒兔、火爆脆肠',addr:'龙灯山',lat:30.598,lng:104.115,tags:['川菜','家常']},
  {id:31,name:'清香黑豆花',cat:'川菜',rec:'黑豆花水煮鱼、宫保虾球',addr:'双源社区',lat:30.564,lng:104.051,tags:['豆花','川菜']},
  {id:32,name:'永盛猪耳朵',cat:'川菜',rec:'凉拌猪耳朵、猪肝拼鸡',addr:'永通路',lat:30.578,lng:104.048,tags:['凉菜','川菜']},
  {id:33,name:'温江李记肥肠粉',cat:'粉面',rec:'红汤肥肠粉、牛肉锅盔',addr:'第五医院',lat:30.698,lng:103.836,tags:['肥肠粉','温江']},
  {id:34,name:'逸景轩土菜馆',cat:'川菜',rec:'肝腰合炒、石磨豆花、粉蒸牛肉',addr:'科兴路东段',lat:30.611,lng:104.058,tags:['土菜','川菜']},
  {id:35,name:'乔一乔怪味餐厅',cat:'川菜',rec:'怪味干锅、巴骨肉、扯面',addr:'东升',lat:30.571,lng:103.919,tags:['干锅','怪味']},
  {id:36,name:'黄甲大竹林兔头餐厅',cat:'兔头',rec:'鲜兔头、红烧兔、焖焖鱼',addr:'双流',lat:30.559,lng:103.923,tags:['兔头','双流']},
  {id:37,name:'尚记烧烤',cat:'烧烤',rec:'卤猪尾、鸡全翅、无骨猪蹄',addr:'时代雅居',lat:30.623,lng:104.042,tags:['烧烤','夜宵']},
  {id:38,name:'牟抄手',cat:'抄手',rec:'红油抄手、怪味抄手、海味抄手',addr:'温江',lat:30.694,lng:103.835,tags:['抄手','温江']},
  {id:39,name:'龙师傅小院鳝鱼',cat:'川菜',rec:'藿香土鳝鱼、大蒜烧鳝鱼',addr:'温江大学城',lat:30.720,lng:103.856,tags:['鳝鱼','温江']},
  {id:40,name:'李孃兔头',cat:'兔头',rec:'麻辣兔头、卤鸭头',addr:'西安路',lat:30.668,lng:104.045,tags:['兔头','老店']},
  {id:41,name:'朱琼碧肥肠粉',cat:'粉面',rec:'肥肠粉、拌肠头、热拌心肺',addr:'抚琴',lat:30.680,lng:104.025,tags:['肥肠粉','抚琴']},
  {id:42,name:'黑竹香鸡',cat:'川菜',rec:'乌鸡芋儿锅、手工魔芋、笋片',addr:'营和巷',lat:30.675,lng:104.045,tags:['鸡','火锅']},
  {id:43,name:'魏记卤菜川菜馆',cat:'川菜',rec:'卤鸭子、鱼香茄饼、回锅肉',addr:'龙潭寺东路',lat:30.705,lng:104.145,tags:['卤菜','川菜']},
  {id:44,name:'金麒麟兔火锅',cat:'火锅',rec:'兔火锅、鲜兔腰、脆兔肚',addr:'猛追湾',lat:30.667,lng:104.095,tags:['兔火锅','猛追湾']},
  {id:45,name:'雪梅烧烤',cat:'烧烤',rec:'烤鸡翅、烤藕片、五花肉',addr:'保利花园',lat:30.588,lng:103.978,tags:['烧烤','夜宵']},
  {id:46,name:'罗姐竹笋芋儿鸡',cat:'川菜',rec:'竹笋芋儿鸡拼鸡爪、肥肠',addr:'肖家河街',lat:30.628,lng:104.035,tags:['芋儿鸡','肖家河']},
  {id:47,name:'陶记蛋烘糕',cat:'小吃',rec:'麻辣牛肉、奶油肉松',addr:'武侯祠',lat:30.645,lng:104.048,tags:['蛋烘糕','武侯祠']},
  {id:48,name:'严太婆锅魁',cat:'锅盔',rec:'凉粉锅魁、牛肉锅魁、红糖锅魁',addr:'文殊院',lat:30.678,lng:104.064,tags:['锅魁','老店']},
  {id:49,name:'姜蹄花',cat:'蹄花',rec:'海带炖蹄花、雪豆蹄花、卤肥肠',addr:'宁夏街',lat:30.673,lng:104.058,tags:['蹄花','老店']},
  {id:50,name:'鲜知味钵钵鸡',cat:'钵钵鸡',rec:'钵钵鸡、鸡胗、无骨凤爪',addr:'草堂北路',lat:30.659,lng:104.035,tags:['钵钵鸡','草堂']},
  {id:51,name:'炙缘夜光杯',cat:'烧烤',rec:'烤串、把把烧、锡纸脑花',addr:'清江东路',lat:30.670,lng:104.022,tags:['烧烤','夜宵']},
  {id:52,name:'曾哥烧烤店',cat:'烧烤',rec:'五花、排骨、鸡脚、烤茄子',addr:'红瓦寺',lat:30.635,lng:104.082,tags:['烧烤','川大']},
  {id:53,name:'吴记怪味面',cat:'面食',rec:'怪味面、海味面、杂酱面',addr:'牛王庙',lat:30.647,lng:104.088,tags:['面食','怪味']},
  {id:54,name:'锦城印象火锅',cat:'火锅',rec:'鲜毛肚、九尺鸭肠、现炸酥肉',addr:'宽窄巷子',lat:30.668,lng:104.052,tags:['火锅','宽窄巷子']},
  {id:55,name:'洞子口张老二凉粉',cat:'小吃',rec:'甜水面、煮凉粉、凉糕',addr:'文殊院',lat:30.677,lng:104.064,tags:['凉粉','甜水面','老店']},
  {id:56,name:'满江红串串香',cat:'串串',rec:'牛肉、小郡肝、毛肚、干碟',addr:'七道堰街',lat:30.639,lng:104.024,tags:['串串','老店']},
  {id:57,name:'小妹滋补蹄花',cat:'蹄花',rec:'滋补蹄花汤、卤猪蹄',addr:'理工大学',lat:30.679,lng:104.168,tags:['蹄花','理工大']},
  {id:58,name:'伍妹冒烤鸭',cat:'烤鸭',rec:'冒烤鸭、冒宽粉、冒土豆片',addr:'钢一区',lat:30.658,lng:104.135,tags:['冒烤鸭','钢一区']},
  {id:59,name:'老字号冒节子肥肠粉',cat:'粉面',rec:'红汤肥肠粉、牛肉锅盔',addr:'站北农贸市场',lat:30.704,lng:104.092,tags:['肥肠粉','老字号']},
  {id:60,name:'徐钵钵鸡',cat:'钵钵鸡',rec:'红油钵钵鸡、藤椒钵钵鸡',addr:'川大',lat:30.635,lng:104.080,tags:['钵钵鸡','川大']},
  {id:61,name:'大石人家鱿鱼面馆',cat:'面食',rec:'招牌鱿鱼面、生椒牛肉面',addr:'大石西路',lat:30.655,lng:104.021,tags:['面食','鱿鱼']},
  {id:62,name:'华丰老火锅',cat:'火锅',rec:'鲜毛肚、千层肚、发鱿鱼',addr:'双林北横路',lat:30.663,lng:104.108,tags:['火锅','老店']},
  {id:63,name:'土红糖凉糕',cat:'甜品',rec:'土红糖凉糕、桂花凉糕、冰粉',addr:'东升街道',lat:30.568,lng:103.920,tags:['甜品','凉糕']},
  {id:64,name:'邓氏兔头',cat:'兔头',rec:'兔头、兔腿、卤鸭头',addr:'西北桥',lat:30.689,lng:104.055,tags:['兔头','老店']},
  {id:65,name:'洞子口陈氏凉粉',cat:'小吃',rec:'凉粉、粉蒸牛肉、拌肥肠',addr:'九里堤',lat:30.698,lng:104.045,tags:['凉粉','九里堤']},
  {id:66,name:'袁记串串香',cat:'串串',rec:'牛肉串串、毛肚、黄喉',addr:'新南门',lat:30.645,lng:104.073,tags:['串串','老店']},
  {id:67,name:'晏烤鸭',cat:'烤鸭',rec:'冒烤鸭、干拌烤鸭、红油鸭肠',addr:'天成街',lat:30.670,lng:104.060,tags:['烤鸭','老店']},
  {id:68,name:'四妹钵钵鸡',cat:'钵钵鸡',rec:'钵钵鸡、鸡汤饭',addr:'太古里',lat:30.660,lng:104.082,tags:['钵钵鸡','太古里']},
  {id:69,name:'又巳',cat:'甜品',rec:'盐面包、碱水结、梅子气泡水',addr:'二环路南四段',lat:30.622,lng:104.055,tags:['面包','甜品']},
  {id:70,name:'老沈串串香',cat:'串串',rec:'牛肉、毛肚、冒脑花',addr:'红牌楼',lat:30.619,lng:104.018,tags:['串串','红牌楼']},
  {id:71,name:'瓦烤',cat:'烧烤',rec:'虎皮凤爪、双椒牛肉、烤苕皮',addr:'长顺中街',lat:30.669,lng:104.058,tags:['烧烤','宽窄巷子']},
  {id:72,name:'重庆森林钵钵鸡',cat:'钵钵鸡',rec:'钵钵鸡、冒脑花、素豆汤饭',addr:'川大',lat:30.634,lng:104.079,tags:['钵钵鸡','川大']},
  {id:73,name:'叶鸭子',cat:'烤鸭',rec:'冒烤鸭、拌猪杂、烧鸭血',addr:'琴台大厦',lat:30.662,lng:104.047,tags:['烤鸭','老店']},
  {id:74,name:'王朝花椒鱼',cat:'川菜',rec:'青花椒鱼、鲜毛肚、宽粉',addr:'杉板桥南一路',lat:30.659,lng:104.118,tags:['鱼','花椒']},
  {id:75,name:'好滋味实惠馆',cat:'川菜',rec:'蒜苗回锅肉、粉蒸牛肉',addr:'三友路',lat:30.688,lng:104.073,tags:['川菜','实惠']},
  {id:76,name:'贵州兴义牛肉粉',cat:'粉面',rec:'牛肉粉、剪粉、煎蛋',addr:'花牌坊',lat:30.670,lng:104.038,tags:['牛肉粉','贵州']},
  {id:77,name:'旺龙小食堂',cat:'川菜',rec:'肥肠血旺、花椒鸡',addr:'高升桥',lat:30.633,lng:104.041,tags:['川菜','高升桥']},
  {id:78,name:'重庆老家耗儿鱼',cat:'川菜',rec:'麻辣耗儿鱼、香辣美蛙、宽粉',addr:'好百年',lat:30.656,lng:104.075,tags:['鱼','耗儿鱼']},
  {id:79,name:'孙记三碗饺',cat:'抄手',rec:'红油水饺、清汤水饺、甜水面',addr:'紫竹苑',lat:30.618,lng:104.058,tags:['水饺','老店']},
  {id:80,name:'白家老店肥肠粉',cat:'粉面',rec:'肥肠粉、牛肉锅盔、拌肥肠',addr:'武侯祠',lat:30.643,lng:104.049,tags:['肥肠粉','武侯祠']},
  {id:81,name:'凉水井',cat:'甜品',rec:'冰粉、红糖糍粑、凉虾、凉糕',addr:'明城新店',lat:30.665,lng:104.095,tags:['冰粉','甜品']},
  {id:82,name:'谭氏纸包鱼',cat:'川菜',rec:'蒜香纸包鱼、纸上牛蛙',addr:'中海国际',lat:30.722,lng:103.966,tags:['纸包鱼','高新西']},
  {id:83,name:'罗眼镜串串香',cat:'串串',rec:'牛肉、小郡肝、毛肚',addr:'蜀都西苑',lat:30.685,lng:104.010,tags:['串串','蜀都']},
  {id:84,name:'川工第壹漂',cat:'串串',rec:'冷锅串串、冒脑花、麻辣牛肉',addr:'学府园',lat:30.678,lng:104.062,tags:['冷锅串串','学府']},
  {id:85,name:'张姐兔腰',cat:'小吃',rec:'麻辣兔腰、烤兔腰、冒兔头',addr:'幸福家园',lat:30.638,lng:104.065,tags:['兔腰','小吃']},
  {id:86,name:'汤王谢氏牛肉粉',cat:'粉面',rec:'红烧牛肉粉、牛杂粉、煎蛋',addr:'长久一巷',lat:30.699,lng:104.032,tags:['牛肉粉','早餐']},
  {id:87,name:'邓记新一代糖油果子',cat:'小吃',rec:'糖油果子、红糖糍粑',addr:'宽窄巷子',lat:30.669,lng:104.054,tags:['糖油果子','宽窄巷子']},
  {id:88,name:'易老大蛋烘糕',cat:'小吃',rec:'奶油肉松、麻辣牛肉',addr:'奎星楼街',lat:30.668,lng:104.055,tags:['蛋烘糕','奎星楼']},
  {id:89,name:'冯老太婆老妈蹄花',cat:'蹄花',rec:'老妈蹄花、芸豆蹄花、回锅肉',addr:'下同仁路',lat:30.668,lng:104.050,tags:['蹄花','宽窄巷子']},
  {id:90,name:'禅泉冰粉',cat:'冰粉',rec:'三鲜冰粉、糍粑冰粉、全家福冰粉',addr:'宽窄巷子',lat:30.668,lng:104.051,tags:['冰粉','宽窄巷子']},
  {id:91,name:'沈堂甜水面',cat:'面食',rec:'甜水面、干拌抄手、冰醉豆花',addr:'玉林路',lat:30.630,lng:104.050,tags:['甜水面','玉林']},
  {id:92,name:'味之绝美蛙鱼',cat:'川菜',rec:'美蛙+鱼头双拼、仔姜蛙',addr:'锦华万达',lat:30.620,lng:104.098,tags:['美蛙','鱼头']},
  {id:93,name:'邱二哥锅盔',cat:'锅盔',rec:'红糖锅盔、白面锅盔、椒盐锅盔',addr:'文殊院',lat:30.677,lng:104.066,tags:['锅盔','老店']},
  {id:94,name:'宫廷糕点铺',cat:'甜品',rec:'桃酥、拿破仑、椒盐酥',addr:'文殊院',lat:30.676,lng:104.067,tags:['糕点','老店','排队']},
  {id:95,name:'曹鸡片豆汤饭',cat:'川菜',rec:'鸡片豆汤饭、凉拌鸡片、蒸肥肠',addr:'草堂北支路',lat:30.660,lng:104.032,tags:['豆汤饭','草堂']},
  {id:96,name:'陈麻婆豆腐',cat:'川菜',rec:'麻婆豆腐、夫妻肺片、豆瓣鱼',addr:'东华门街',lat:30.662,lng:104.062,tags:['麻婆豆腐','老店','名店']},
  {id:97,name:'陈六孃翘脚牛肉',cat:'川菜',rec:'翘脚牛肉汤锅、嫩牛肉、毛肚',addr:'青羊大道',lat:30.668,lng:104.001,tags:['翘脚牛肉','牛杂']},
  {id:98,name:'绿屏源火锅',cat:'火锅',rec:'鲜毛肚、九尺鸭肠、耙鸡脚',addr:'抚琴西路',lat:30.683,lng:104.022,tags:['火锅','抚琴']},
  {id:99,name:'龙江乌鱼庄',cat:'川菜',rec:'酸菜乌鱼、麻辣乌鱼、乌鱼片',addr:'三江苑小区',lat:30.612,lng:103.994,tags:['乌鱼','酸菜鱼']}
];

// ---- Helper: get all shops (base + user-added) ----
function getAllShops() {
  const userShops = getUserShops();
  return [...BASE_SHOPS, ...userShops];
}

function getBaseShop(id) {
  return BASE_SHOPS.find(s => s.id === id);
}

// ---- User-added shops (localStorage) ----
const USER_SHOPS_KEY = 'cd-user-shops';
let _nextUserId = 1000;

function getNextUserId() {
  const userShops = getUserShops();
  if (userShops.length === 0) return 1000;
  return Math.max(...userShops.map(s => s.id)) + 1;
}

function getUserShops() {
  try {
    const raw = localStorage.getItem(USER_SHOPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveUserShops(shops) {
  localStorage.setItem(USER_SHOPS_KEY, JSON.stringify(shops));
}

function addUserShop(shop) {
  const shops = getUserShops();
  shop.id = getNextUserId();
  shop._userAdded = true;
  shop.createdAt = new Date().toISOString();
  shops.push(shop);
  saveUserShops(shops);
  return shop;
}

function deleteUserShop(id) {
  const shops = getUserShops().filter(s => s.id !== id);
  saveUserShops(shops);
}

function updateUserShop(id, updates) {
  const shops = getUserShops();
  const idx = shops.findIndex(s => s.id === id);
  if (idx !== -1) {
    shops[idx] = { ...shops[idx], ...updates };
    saveUserShops(shops);
  }
}

// ---- Unique categories from all shops ----
function getUniqueCategories() {
  const all = getAllShops();
  const cats = new Set(all.map(s => s.cat));
  return ['全部', ...Array.from(cats).sort()];
}
