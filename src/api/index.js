//将四个模块请求的接口函数统一暴露
import * as trademark from "./product/trademark";
import * as attr from "./product/attr";
import * as spu from "./product/spu";
import * as sku from "./product/sku";

import * as user from "./acl/user";
import role from "./acl/role";
import permission from "./acl/permission";
//对外暴露
export default {
  trademark,
  attr,
  sku,
  spu,
  user,
  role,
  permission,
};
