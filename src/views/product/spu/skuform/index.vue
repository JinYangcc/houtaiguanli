<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          placeholder="规格描述"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.AttrIdAndAttrValueId">
              <el-option
                :label="attrvalue.valueName"
                :value="`${attr.id}:${attrvalue.id}`"
                v-for="attrvalue in attr.attrValueList"
                :key="attrvalue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleattr.saleAttrName"
            v-for="saleattr in spuSaleAttrList"
            :key="saleattr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="saleattr.saleattridandsalevalueid"
            >
              <el-option
                :label="saleattrvalue.saleAttrValueName"
                :value="`${saleattr.id}:${saleattrvalue.id}`"
                v-for="saleattrvalue in saleattr.spuSaleAttrValueList"
                :key="saleattrvalue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="prop" width="80" type="selection">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault"
                @click="changeisDefault(row)"
                >设为默认</el-button
              >
              <el-button type="info" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savesku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "skuform",
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [],
        //平台属性
        skuAttrValueList: [],
        //销售属性
        skuSaleAttrValueList: [],
      },
      spu: {},
      imageList: [], //收集图片 数据不完整 需要整理参数
    };
  },
  methods: {
    //*获取sku数据
    async getskudata(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      const result = await this.$API.spu.reqSpuImageLIst(spu.id);
      if (result.code == 200) {
        let imglist = result.data;
        imglist.forEach((item) => {
          item.isDefault = true;
        });
        this.spuImageList = imglist;
      }
      const result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      const result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    //*复选框点击事件
    handleSelectionChange(val) {
      // console.log(val);
      this.imageList = val;
    },
    //*点击设置默认排他操作
    changeisDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = true;
      });
      row.isDefault = false;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //*取消
    cancel() {
      this.$emit("changeScenes", 1);
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    //*保存
    async savesku() {
      const { skuInfo, attrInfoList, spuSaleAttrList, imageList } = this;
      //?整理平台属性
      attrInfoList.forEach((item) => {
        if (item.AttrIdAndAttrValueId) {
          const [attrId, valueId] = item.AttrIdAndAttrValueId.split(":");
          const obj = { attrId, valueId };
          skuInfo.skuAttrValueList.push(obj);
        }
      });
      //?整理销售属性
      spuSaleAttrList.forEach((item) => {
        if (item.saleattridandsalevalueid) {
          const [saleAttrId, saleAttrValueId] =
            item.saleattridandsalevalueid.split(":");
          const obj1 = { saleAttrId, saleAttrValueId };
          skuInfo.skuSaleAttrValueList.push(obj1);
        }
      });
      //?整理图片
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      const result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        console.log(result);
        this.$emit("changeScenes", 1);
      }
    },
  },
};
</script>

<style>
</style>