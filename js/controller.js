// var todo=[
//     {
//       id:1,
//       color:'#c970e3',
//       color2:'rgba(201,112,207,0.5)',
//       title:"列表1",
//       list:[{title:111111,done:false},{title:222222,done:true},{title:33333,done:true}]
//     },
//     {
//       id:2,
//       color:'#6ddc31',
//       color2:'rgba(109,220,49,0.5)',
//       title:"列表2",
//       list:[{title:222222,done:true},{title:33333,done:true},{title:44444,done:false}]
//     },
//     {
//       id:3,
//       color:'#40abf8',
//       color2:'rgba(64,171,248,0.5)',
//       title:"列表3",
//       list:[{title:154454,done:false},{title:222222,done:true},{title:33333,done:true},{title:44444,done:false}]
//     },
//     {
//       id:4,
//       color:'#f2c800',
//       color2:'rgba(242,203,0,0.5)',
//       title:"列表4",
//       list:[{title:1551,done:false},{title:222222,done:true},{title:33563,done:true},{title:44444,done:false}]
//     }
// ];

var ctrl=angular.module("ctrl",[]);
var colors=['#c970e3','#6ddc31','#40abf8','#f2c800','#a0b55e','#f82469','#f99500'];

// var colors2=['rgba(201,112,207,0.5)','rgba(109,220,49,0.5)','rgba(64,171,248,0.5)','rgba(242,203,0,0.5)','rgba(160,181,94,0.5)','rgba(248,36,105,0.5)','rgba(249,149,0,0.5)'];

ctrl.factory('localS',function () {
    return{
        getdata:function () {
            var data=localStorage.getItem('td');
            if(data==null){
                return[
                    {
                        id:1,
                        title:'列表1',
                        color:'#C970E3',
                        color2:'rgba(201,112,207,0.2)',
                        list:[]
                    }
                ]
            }else {
                return JSON.parse(data);
            }
        },
      savedata:function (data) {
          localStorage.setItem('td',JSON.stringify(data))
      }  

    }
});


ctrl.controller('c',function($scope,$filter,localS){
    $scope.todo=localS.getdata();
    // $scope.todo=todo;
    $scope.index=0;
    $scope.setShow=false;
    $scope.comFlag=false;
    $scope.colors=colors;
    // $scope.colors2=colors2;
    // 左边增加列表
    $scope.add=function(){
        $scope.comFlag=false;
        var id=$scope.todo[$scope.todo.length-1].id+1;
        var i=$scope.todo.length%7;  //得到颜色下标
        $scope.todo.push({
            id:id,
            color:colors[i],
            // color2:colors2[i],
            title:"列表"+id,
            list:[]
        })
         $scope.index=id-1;
         localS.savedata($scope.todo);
    }
   // 选中左边的某一个列表
    $scope.select=function(i){
        $scope.index=i;
        $scope.comFlag=false;
    }
    // 选项  show  hide
    $scope.change=function(){
        $scope.setShow=!$scope.setShow;
        var o=$scope.todo[$scope.index];
        $scope.cTitle=o.title;
        $scope.cColor=o.color;
        $scope.cColor2=o.color2;
    }
    //选项  改变整体颜色
    
    $scope.changeColor=function(c,i){
       $scope.cColor=c;
       // $scope.cColor2=$scope.todo[i].color2;
       
    }
    //选项  修改颜色完成
    $scope.done=function(){
      var o=$scope.todo[$scope.index];
      o.title=$scope.cTitle;
      o.color=$scope.cColor;
      // o.color2=$scope.cColor2;
      $scope.setShow=false;
      localS.savedata($scope.todo);
    }
    //选项  取消
    $scope.cancel=function(){
      $scope.setShow=false;
    }
    //选项  删除
    $scope.del=function(){
      $scope.todo.splice($scope.index,1);
      $scope.index=0;
      $scope.setShow=false;
      localS.savedata($scope.todo);
    }
    // 右边已完成  三角
    $scope.changeComFlag=function(){
      $scope.comFlag=!$scope.comFlag;
    }
    // 改变已完成  未完成
    $scope.changeState=function(o,s){
      o.done=s;
      $scope.comNum();
      localS.savedata($scope.todo);
    }
    //已完成个数
    $scope.comNum=function(){
      $scope.num=$filter('filter')($scope.todo[$scope.index].list,{'done':true}).length;
    }
    // 改变右边某一条的背景
    $scope.i=-1;
    $scope.bgflag=false;
    $scope.changeBg=function(o,i){
      if(o.done){
        $scope.bgflag=true;
      }else{
        $scope.bgflag=false;
      }  
      $scope.i=i;   
    }

    // 改变文本
    // $scope.changeText=function(o,ev){
    //   o.title=ev.target.innerHTML;
    // }
    
    // 添加新列表
    $scope.newadd=function(){
      var newtodo ={title:' ',done:false};
      $scope.todo[$scope.index].list.push(newtodo);
      localS.savedata($scope.todo);
    }
    // 清除已完成事件
    $scope.clear=function(){
      var list=$scope.todo[$scope.index].list;
      $scope.todo[$scope.index].list=$filter('filter')(list,{'done':false});
      // $scope.num=0;
      $scope.comNum();
      $scope.comFlag=false;
      localS.savedata($scope.todo);
    }

    // $scope.delyes = function(index){
    //   var list=$scope.todo[$scope.index].list;
    //   $filter('filter')(list,{'done':true}).splice($scope.todo[$scope.index].list,1);
    // }
    // $scope.delno = function(index){
    //   var list=$scope.todo[$scope.index].list;
    //   var no=$filter('filter')(list,{'done':false});
    //   no.splice($scope.todo[$scope.index],1);
    // }

    $scope.saveData=function(){
      localS.savedata($scope.todo);
    }

    // 监测已完成数
    $scope.$watch('index',function(){
      $scope.comNum();
    })
})