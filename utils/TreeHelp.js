class TreeHelp{
    static toChildrenStruct(pidArray) {
        //将pid结构的树型数据转换成children结构
        let childrenArray = [];
        let itemMap = {};
        if (!pidArray) {
          return childrenArray;
        } else {
          for (let item of pidArray) {
            item.key = item.id;
            item.value = item.id;
            item.title = item.name;
            itemMap[item.id] = item;
          }
    
          for (let item of pidArray) {
            let parent = itemMap[item.pid];
            if (typeof parent === "undefined") {
              //pid不存在，是顶级元素
              item._index = childrenArray.length;
              childrenArray.push(item);
            } else {
              if (typeof parent.children === "undefined") {
                parent.children = [];
              }
              item._index = parent.children.length;
              parent.children.push(item);
            }
          }
        }
        return  childrenArray;
      }
      
      static getTreeNode(treeData,nodeId){
        let node;
        for(var i=0;i<treeData.length;i++){
          if(treeData[i].id === nodeId){
            node=treeData[i];
            break;
          }else if(treeData[i].children){
            let snode = this.getTreeNode(treeData[i].children,nodeId);
            if(snode){
              node = snode;
              break;
            }
          }
        }
        return node;
      }
}
export default TreeHelp;