<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- //!照片墙 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unsaleattr.length}项未选择`"
          v-model="attr"
        >
          <el-option
            :label="unsaleattr.name"
            :value="`${unsaleattr.id}:${unsaleattr.name}`"
            v-for="unsaleattr in unsaleattr"
            :key="unsaleattr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attr"
          @click="addsaleattr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addorupdate">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "spuform",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集 已有的
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [],
      spuImageList: [],
      baseSaleAttrList: [], //全部的销售属性
      // inputVisible: false,
      inputValue: "",
      attr: "",
    };
  },
  computed: {
    //*未选择的销售属性
    unsaleattr() {
      const result = this.baseSaleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
  methods: {
    //*点击添加spu按钮获取数据
    async getadddata(category3Id) {
      this.spu.category3Id = category3Id;
      //*获取品牌数据
      const tradeMarkListreq = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkListreq.code == 200) {
        this.tradeMarkList = tradeMarkListreq.data;
      }
      //*获取销售属性数据
      const baseSaleAttrListreq = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrListreq.code == 200) {
        this.baseSaleAttrList = baseSaleAttrListreq.data;
      }
    },
    //*照片墙删除照片事件
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.spuImageList = fileList;
    },
    //*照片墙放大事件
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //*照片墙上传成功事件
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    //*点击编辑按钮初始化数据
    async initdata(row) {
      //*获取spu数据
      const spureq = await this.$API.spu.reqSpu(row.id);
      if (spureq.code == 200) {
        this.spu = spureq.data;
      }
      //*获取品牌数据
      const tradeMarkListreq = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkListreq.code == 200) {
        this.tradeMarkList = tradeMarkListreq.data;
      }
      //*获取图片数据
      const spuImageListreq = await this.$API.spu.reqSpuImageList(row.id);
      if (spuImageListreq.code == 200) {
        const imgarr = spuImageListreq.data;
        imgarr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = imgarr;
      }
      //*获取销售属性数据
      const baseSaleAttrListreq = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrListreq.code == 200) {
        this.baseSaleAttrList = baseSaleAttrListreq.data;
      }
    },
    //*删除属性值
    // handleClose(row, index) {
    //   row.spuSaleAttrValueList.splice(index, 1);
    // },
    //*点击添加属性值
    showInput(row) {
      // console.log(row);
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    //*失焦或者回车事件
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() == "") {
        this.$message("属性值为空");
        return;
      }
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!result) {
        this.$message.error("属性值重复");
        return;
      }
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
      // const { baseSaleAttrId, inputValue } = row;
      // if (inputValue.trim() == "") {
      //   this.$message.error("属性值为空");
      //   return;
      // }
      // const result = row.spuSaleAttrValueList.every((item) => {
      //   item.saleAttrValueName == inputValue;
      // });
      // console.log(result);
      // if (result) return;
      // const newattrvalue = {
      //   baseSaleAttrId,
      //   saleAttrValueName: inputValue,
      // };
      // row.spuSaleAttrValueList.push(newattrvalue);
      // row.inputVisible = false;
      // row.inputValue = "";
    },
    //*添加销售属性
    addsaleattr() {
      const [baseSaleAttrId, saleAttrName] = this.attr.split(":");
      const newattr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newattr);
      this.attr = "";
    },
    //*保存按钮事件
    async addorupdate() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        this.$emit("changescene", 1);
      }
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    //*取消按钮的事件
    cancel() {
      this.$emit("changescene", 1);
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>