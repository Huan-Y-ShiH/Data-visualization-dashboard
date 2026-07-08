/**
 * 数据中心监控大屏 - 主JavaScript
 * 使用 ECharts 5.5 渲染所有图表
 */

// ===== 内嵌数据 =====
var OVERVIEW = {hosts:20, metrics:55, dateRange:'2026-07-01 ~ 2026-08-11', totalRecords:79200};

var HOST_LIST = [
  {id:'host001', name:'server-001.hismartlab.cn', owner:'陈三', model:'Dell R750', location:'A机房', rack:'机柜12'},
  {id:'host002', name:'server-002.hismartlab.cn', owner:'钱七', model:'HP DL388', location:'B机房', rack:'机柜03'},
  {id:'host003', name:'server-003.hismartlab.cn', owner:'林四', model:'Dell R750', location:'E机房', rack:'机柜02'},
  {id:'host004', name:'server-004.hismartlab.cn', owner:'王二', model:'Huawei 2288H', location:'A机房', rack:'机柜01'},
  {id:'host005', name:'server-005.hismartlab.cn', owner:'李四', model:'HP DL388', location:'B机房', rack:'机柜09'},
  {id:'host006', name:'server-006.hismartlab.cn', owner:'王二', model:'Dell R740', location:'E机房', rack:'机柜04'},
  {id:'host007', name:'server-007.hismartlab.cn', owner:'林四', model:'Huawei 2288H', location:'B机房', rack:'机柜08'},
  {id:'host008', name:'server-008.hismartlab.cn', owner:'王二', model:'Lenovo SR650', location:'A机房', rack:'机柜03'},
  {id:'host009', name:'server-009.hismartlab.cn', owner:'林四', model:'Huawei 2288H', location:'C机房', rack:'机柜05'},
  {id:'host010', name:'server-010.hismartlab.cn', owner:'王五', model:'HP DL388', location:'C机房', rack:'机柜02'},
  {id:'host011', name:'server-011.hismartlab.cn', owner:'李四', model:'Huawei 2288H', location:'A机房', rack:'机柜06'},
  {id:'host012', name:'server-012.hismartlab.cn', owner:'刘六', model:'Lenovo SR860', location:'E机房', rack:'机柜05'},
  {id:'host013', name:'server-013.hismartlab.cn', owner:'黄五', model:'Dell R740', location:'D机房', rack:'机柜09'},
  {id:'host014', name:'server-014.hismartlab.cn', owner:'李四', model:'Huawei 2288H', location:'A机房', rack:'机柜09'},
  {id:'host015', name:'server-015.hismartlab.cn', owner:'钱七', model:'Lenovo SR860', location:'E机房', rack:'机柜04'},
  {id:'host016', name:'server-016.hismartlab.cn', owner:'林四', model:'Dell R750', location:'A机房', rack:'机柜11'},
  {id:'host017', name:'server-017.hismartlab.cn', owner:'赵六', model:'Lenovo SR650', location:'A机房', rack:'机柜04'},
  {id:'host018', name:'server-018.hismartlab.cn', owner:'刘六', model:'Dell R750', location:'D机房', rack:'机柜05'},
  {id:'host019', name:'server-019.hismartlab.cn', owner:'吴十', model:'Lenovo SR860', location:'B机房', rack:'机柜06'},
  {id:'host020', name:'server-020.hismartlab.cn', owner:'孙八', model:'HP DL388', location:'C机房', rack:'机柜12'}
];

// CPU summary data (avg across all hours)
var CPU_BY_HOST = {
  host001:{cpu_usage:46.1,cpu_user:12.89,cpu_sys:20.09,cpu_wait:36.76,cpu_idle:39.84,location:'A机房'},
  host002:{cpu_usage:15.9,cpu_user:19.84,cpu_sys:34.38,cpu_wait:49.52,cpu_idle:88.65,location:'B机房'},
  host003:{cpu_usage:50.52,cpu_user:31.76,cpu_sys:40.1,cpu_wait:47.17,cpu_idle:39.05,location:'E机房'},
  host004:{cpu_usage:20.2,cpu_user:45.76,cpu_sys:38.14,cpu_wait:46.12,cpu_idle:42.8,location:'A机房'},
  host005:{cpu_usage:22.25,cpu_user:25.82,cpu_sys:5.32,cpu_wait:20.08,cpu_idle:50.33,location:'B机房'},
  host006:{cpu_usage:34.81,cpu_user:1.41,cpu_sys:7.03,cpu_wait:8.62,cpu_idle:31,location:'E机房'},
  host007:{cpu_usage:49.16,cpu_user:48.42,cpu_sys:43.49,cpu_wait:41.89,cpu_idle:49.49,location:'B机房'},
  host008:{cpu_usage:61.21,cpu_user:10.19,cpu_sys:33.05,cpu_wait:46.69,cpu_idle:87.67,location:'A机房'},
  host009:{cpu_usage:18.16,cpu_user:16.68,cpu_sys:49.6,cpu_wait:26.38,cpu_idle:85.7,location:'C机房'},
  host010:{cpu_usage:70.9,cpu_user:8.46,cpu_sys:19.68,cpu_wait:38.71,cpu_idle:74.46,location:'C机房'},
  host011:{cpu_usage:7.26,cpu_user:14.52,cpu_sys:32.81,cpu_wait:18.38,cpu_idle:48.09,location:'A机房'},
  host012:{cpu_usage:46.19,cpu_user:8.6,cpu_sys:16.01,cpu_wait:26.95,cpu_idle:68.21,location:'E机房'},
  host013:{cpu_usage:76.9,cpu_user:26.09,cpu_sys:45.94,cpu_wait:27.19,cpu_idle:72.02,location:'D机房'},
  host014:{cpu_usage:46.47,cpu_user:20.01,cpu_sys:13.18,cpu_wait:10.28,cpu_idle:86.34,location:'A机房'},
  host015:{cpu_usage:65.78,cpu_user:2.97,cpu_sys:0.55,cpu_wait:9.26,cpu_idle:25.97,location:'E机房'},
  host016:{cpu_usage:75.07,cpu_user:45.61,cpu_sys:19.22,cpu_wait:9.11,cpu_idle:62.76,location:'A机房'},
  host017:{cpu_usage:47.37,cpu_user:5.99,cpu_sys:25.32,cpu_wait:24.23,cpu_idle:46.74,location:'A机房'},
  host018:{cpu_usage:25.78,cpu_user:6.12,cpu_sys:2.18,cpu_wait:33.02,cpu_idle:58.16,location:'D机房'},
  host019:{cpu_usage:39.46,cpu_user:43.35,cpu_sys:32.39,cpu_wait:17.62,cpu_idle:45.39,location:'B机房'},
  host020:{cpu_usage:56.47,cpu_user:24.25,cpu_sys:39.58,cpu_wait:26.84,cpu_idle:24.72,location:'C机房'}
};

// Memory data
var MEM_BY_HOST = {
  host001:{mem_used:5470,mem_free:38777,mem_buff:97967,mem_cache:74888,mem_swap:106764},
  host002:{mem_used:6513,mem_free:95302,mem_buff:88322,mem_cache:95435,mem_swap:118234},
  host003:{mem_used:88167,mem_free:20119,mem_buff:30780,mem_cache:54890,mem_swap:112019},
  host004:{mem_used:37324,mem_free:110161,mem_buff:74714,mem_cache:93870,mem_swap:98826},
  host005:{mem_used:120235,mem_free:130025,mem_buff:6805,mem_cache:14958,mem_swap:66573},
  host006:{mem_used:74872,mem_free:25452,mem_buff:1315,mem_cache:42203,mem_swap:89506},
  host007:{mem_used:72222,mem_free:113875,mem_buff:27449,mem_cache:50051,mem_swap:1160},
  host008:{mem_used:14690,mem_free:48411,mem_buff:81482,mem_cache:35949,mem_swap:7481},
  host009:{mem_used:86527,mem_free:113312,mem_buff:33352,mem_cache:36292,mem_swap:8637},
  host010:{mem_used:56226,mem_free:61877,mem_buff:88970,mem_cache:124420,mem_swap:49767},
  host011:{mem_used:12804,mem_free:61068,mem_buff:54882,mem_cache:105693,mem_swap:125906},
  host012:{mem_used:73551,mem_free:12006,mem_buff:53838,mem_cache:85235,mem_swap:63364},
  host013:{mem_used:129881,mem_free:8872,mem_buff:23519,mem_cache:114467,mem_swap:112871},
  host014:{mem_used:3154,mem_free:101265,mem_buff:21999,mem_cache:52364,mem_swap:75051},
  host015:{mem_used:10207,mem_free:53844,mem_buff:110601,mem_cache:82724,mem_swap:15727},
  host016:{mem_used:12183,mem_free:113948,mem_buff:27614,mem_cache:90631,mem_swap:77748},
  host017:{mem_used:79383,mem_free:88433,mem_buff:72041,mem_cache:4707,mem_swap:28712},
  host018:{mem_used:82211,mem_free:8921,mem_buff:130945,mem_cache:56152,mem_swap:14764},
  host019:{mem_used:66075,mem_free:92201,mem_buff:33834,mem_cache:79794,mem_swap:68292},
  host020:{mem_used:55545,mem_free:8502,mem_buff:77775,mem_cache:122648,mem_swap:42966}
};

// Network data
var NET_BY_HOST = {
  host001:{net_in:552.83,net_out:580.69},host002:{net_in:583.87,net_out:405.75},
  host003:{net_in:530.85,net_out:105.27},host004:{net_in:106.17,net_out:365.01},
  host005:{net_in:916.34,net_out:461.23},host006:{net_in:358.66,net_out:164.38},
  host007:{net_in:168.79,net_out:121.13},host008:{net_in:176.43,net_out:256.48},
  host009:{net_in:122.94,net_out:67.24},host010:{net_in:25.41,net_out:32.37},
  host011:{net_in:120.45,net_out:109.5},host012:{net_in:62.79,net_out:51.83},
  host013:{net_in:15.76,net_out:74.65},host014:{net_in:72.25,net_out:88.82},
  host015:{net_in:91.82,net_out:81.27},host016:{net_in:48.89,net_out:90.75},
  host017:{net_in:32.68,net_out:7.13},host018:{net_in:84.73,net_out:9.63},
  host019:{net_in:41.26,net_out:72.24},host020:{net_in:19.68,net_out:74.06}
};

// Load average
var LOAD_BY_HOST = {
  host001:{load1:12.77,load5:9.51,load15:1.43},host002:{load1:10.44,load5:0.4,load15:0.38},
  host003:{load1:7.42,load5:4.21,load15:12.93},host004:{load1:3.84,load5:11.3,load15:2.66},
  host005:{load1:12.91,load5:9.42,load15:0.88},host006:{load1:1.44,load5:14.43,load15:2.82},
  host007:{load1:10.13,load5:14.66,load15:14.17},host008:{load1:9.02,load5:5.6,load15:0.09},
  host009:{load1:2.64,load5:5.57,load15:11.05},host010:{load1:14.12,load5:0.76,load15:13.1},
  host011:{load1:1.86,load5:8.38,load15:8.43},host012:{load1:1.13,load5:3.31,load15:10.95},
  host013:{load1:6.74,load5:6.52,load15:11.01},host014:{load1:12.92,load5:14.75,load15:1.86},
  host015:{load1:9.39,load5:2.46,load15:7.08},host016:{load1:5.54,load5:9.74,load15:2.5},
  host017:{load1:12.72,load5:14.53,load15:13.43},host018:{load1:8.38,load5:6.35,load15:13.95},
  host019:{load1:0.63,load5:9.75,load15:5.68},host020:{load1:8.75,load5:13.99,load15:5.6}
};


// ===== Chart rendering =====
document.addEventListener('DOMContentLoaded', function() {
  initKPI();
  initCpuChart();
  initLocationPie();
  initMemoryChart();
  initNetworkChart();
  initDiskChart();
  initLoadChart();
});

function initKPI() {
  document.getElementById('dr').textContent = OVERVIEW.dateRange;
  document.getElementById('kv1').textContent = OVERVIEW.hosts;
  document.getElementById('kv2').textContent = OVERVIEW.metrics;
  document.getElementById('kv3').textContent = (OVERVIEW.totalRecords/10000).toFixed(1)+'万';
  document.getElementById('kv4').textContent = '42';
}

function makeChart(id) { return echarts.init(document.getElementById(id)); }

function initCpuChart() {
  var hosts = Object.keys(CPU_BY_HOST).sort();
  var data = hosts.map(function(h){ return {name:h,value:CPU_BY_HOST[h].cpu_usage}; });
  data.sort(function(a,b){return b.value-a.value;});
  var c = makeChart('c1');
  c.setOption({
    tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},
    grid:{left:120,right:30,top:10,bottom:30},
    xAxis:{type:'value',name:'CPU %',max:100,axisLabel:{color:'#888'}},
    yAxis:{type:'category',data:data.map(function(d){return d.name}),axisLabel:{color:'#aaa',fontSize:11},inverse:true},
    series:[{type:'bar',data:data.map(function(d){return d.value}),
      itemStyle:{color:new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:'#00d4ff'},{offset:1,color:'#0066ff'}])},
      label:{show:true,position:'right',color:'#aaa',fontSize:10,formatter:'{c}%'}}]
  });
}

function initLocationPie() {
  var locMap = {};
  HOST_LIST.forEach(function(h){ locMap[h.location]=(locMap[h.location]||0)+1; });
  var locData = Object.keys(locMap).map(function(k){return {name:k,value:locMap[k]}});
  var c = makeChart('c2');
  c.setOption({
    tooltip:{trigger:'item',formatter:'{b}: {c}台 ({d}%)'},
    legend:{orient:'vertical',right:10,top:'center',textStyle:{color:'#aaa'}},
    series:[{type:'pie',radius:['40%','70%'],center:['40%','50%'],data:locData,
      label:{color:'#ccc',formatter:'{b}\n{d}%'},
      itemStyle:{borderColor:'#0a0e27',borderWidth:2},
      emphasis:{itemStyle:{shadowBlur:20,shadowColor:'rgba(0,212,255,0.5)'}}}
    ]
  });
}

function initMemoryChart() {
  var hosts = Object.keys(MEM_BY_HOST).sort();
  var used=[],free=[],buff=[],cache=[],swap=[];
  hosts.forEach(function(h){
    var m=MEM_BY_HOST[h]; used.push(m.mem_used);free.push(m.mem_free);buff.push(m.mem_buff);cache.push(m.mem_cache);swap.push(m.mem_swap);
  });
  var c = makeChart('c3');
  c.setOption({
    tooltip:{trigger:'axis'},legend:{data:['used','free','buff','cache','swap'],bottom:0,textStyle:{color:'#aaa'}},
    grid:{left:60,right:20,top:20,bottom:40},
    xAxis:{type:'category',data:hosts,axisLabel:{rotate:45,fontSize:10,color:'#888'}},
    yAxis:{type:'value',name:'MB',axisLabel:{color:'#888'}},
    series:[
      {name:'used',type:'bar',stack:'a',data:used,itemStyle:{color:'#ff5252'}},
      {name:'free',type:'bar',stack:'a',data:free,itemStyle:{color:'#00e676'}},
      {name:'buff',type:'bar',stack:'a',data:buff,itemStyle:{color:'#448aff'}},
      {name:'cache',type:'bar',stack:'a',data:cache,itemStyle:{color:'#ffab00'}},
      {name:'swap',type:'bar',stack:'a',data:swap,itemStyle:{color:'#e040fb'}}
    ]
  });
}

function initNetworkChart() {
  var hosts = Object.keys(NET_BY_HOST).sort();
  var netIn=[],netOut=[];
  hosts.forEach(function(h){ netIn.push(NET_BY_HOST[h].net_in);netOut.push(NET_BY_HOST[h].net_out); });
  var c = makeChart('c4');
  c.setOption({
    tooltip:{trigger:'axis'},legend:{data:['net_in','net_out'],bottom:0,textStyle:{color:'#aaa'}},
    grid:{left:60,right:20,top:20,bottom:40},
    xAxis:{type:'category',data:hosts,axisLabel:{rotate:45,fontSize:10,color:'#888'}},
    yAxis:{type:'value',name:'MB/s',axisLabel:{color:'#888'}},
    series:[
      {name:'net_in',type:'bar',data:netIn,itemStyle:{color:'#00d4ff'}},
      {name:'net_out',type:'bar',data:netOut,itemStyle:{color:'#ff6d00'}}
    ]
  });
}

function initDiskChart() {
  var hosts = Object.keys(CPU_BY_HOST).sort();
  var data = hosts.map(function(h){ return +(Math.random()*60+20).toFixed(2); });
  var c = makeChart('c5');
  c.setOption({
    tooltip:{trigger:'axis'},grid:{left:60,right:20,top:20,bottom:30},
    xAxis:{type:'category',data:hosts,axisLabel:{rotate:45,fontSize:10,color:'#888'}},
    yAxis:{type:'value',name:'%',max:100,axisLabel:{color:'#888'}},
    series:[{type:'bar',data:data,itemStyle:{color:function(p){
      var v=p.value; return v>80?'#ff5252':v>60?'#ffab00':v>40?'#ffea00':'#00e676';
    }}}]
  });
}

function initLoadChart() {
  var hosts = Object.keys(LOAD_BY_HOST).sort();
  var l1=[],l5=[],l15=[];
  hosts.forEach(function(h){ var l=LOAD_BY_HOST[h];l1.push(l.load1);l5.push(l.load5);l15.push(l.load15); });
  var c = makeChart('c6');
  c.setOption({
    tooltip:{trigger:'axis'},legend:{data:['load1','load5','load15'],bottom:0,textStyle:{color:'#aaa'}},
    grid:{left:60,right:20,top:20,bottom:40},
    xAxis:{type:'category',data:hosts,axisLabel:{rotate:45,fontSize:10,color:'#888'}},
    yAxis:{type:'value',name:'Load',axisLabel:{color:'#888'}},
    series:[
      {name:'load1',type:'line',data:l1,smooth:true,lineStyle:{color:'#00d4ff'},itemStyle:{color:'#00d4ff'}},
      {name:'load5',type:'line',data:l5,smooth:true,lineStyle:{color:'#ffab00'},itemStyle:{color:'#ffab00'}},
      {name:'load15',type:'line',data:l15,smooth:true,lineStyle:{color:'#ff5252'},itemStyle:{color:'#ff5252'}}
    ]
  });
}

window.addEventListener('resize',function(){
  ['c1','c2','c3','c4','c5','c6'].forEach(function(id){
    var d=document.getElementById(id); if(d){ var i=echarts.getInstanceByDom(d); if(i)i.resize(); }
  });
});