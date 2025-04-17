export let Tools = {
  createTreeNode: (
    arr: Array<any>,
    key: string,
    label: string,
    children: string
  ) => {
    arr.map((item) => {
      Object.values(item).map((value) => {
        if (Array.isArray(value)) {
          Tools.createTreeNode(value, key, label, children);
        } else {
          item["label"] = item[label];
          item["key"] = item[key];
        }
        return value;
      });
      return item;
    });
    return arr;
  },
};
