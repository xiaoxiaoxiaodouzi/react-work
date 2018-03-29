class TreeHelp{
    static toChildrenStruct(pidArray, expandLevel) {
        //将pid结构的树型数据转换成children结构
        let childrenArray = [];
        let expandedItems = [];
        let itemMap = {};
        if (!pidArray) {
          return childrenArray;
        } else {
          for (let item of pidArray) {
            item.key = item.id;
            item.value = item.id;
            item.label = item.name;
            itemMap[item.id] = item;
          }
    
          for (let item of pidArray) {
            let parent = itemMap[item.pid];
            if (typeof parent === "undefined") {
              //pid不存在，是顶级元素
              childrenArray.push(item);
            } else {
              if (typeof parent.children === "undefined") {
                parent.children = [];
                if (expandLevel === -1) expandedItems.push(parent.id);
              }
              parent.children.push(item);
            }
          }
        }
        return  childrenArray;
      }
}
export default TreeHelp;