<template>
  <div>
    <el-card style="margin: 20px 0px">
      <categoryselect @getcategoryid="getcategoryid" :isShow="!isShow"></categoryselect>
    </el-card>
    <el-card>
      <div v-show="isShow">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttr"
          :disabled="category3Id == ''"
          >添加属性</el-button
        >
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                @click="updateAttr(row)"
              ></el-button>
              <!-- <el-button type="danger" icon="el-icon-delete"></el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShow">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <!-- <el-button @click="isShow = true">取消</el-button> -->
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column width="width" prop="prop" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <!-- 这里结构需要用到span与input进行来回的切换 -->
              <!--  -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                :ref="$index"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column width="width" prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import categoryselect from "@/components/categoryselect";
import cloneDeep from "lodash/cloneDeep"; //按需引入深拷贝
export default {
  name: "attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接受平台属性的数据
      attrList: [],
      isShow: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    //*自定义事件  传分类id发请求
    getcategoryid({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getdata();
      }
    },
    //*获取属性信息
    async getdata() {
      //获取分类的ID
      const { category1Id, category2Id, category3Id } = this;
      //获取属性列表的数据
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //*添加属性值按钮事件
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      //自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //*添加属性按钮事件
    addAttr() {
      this.isShow = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    //*修改某属性属性
    updateAttr(row) {
      this.isShow = false;
      this.attrInfo = cloneDeep(row); //深拷贝
      this.attrInfo.attrValueList.forEach((item) => {
        //添加响应式数据
        this.$set(item, "flag", false);
      });
    },
    //*变为查看模式
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message.error("请输入正确的数据");
        return;
      }
      const isRepat = this.attrInfo.attrValueList.some((item) => {
        //* row是数组的最后一个元素
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) return;
      row.flag = false;
    },
    //*变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        //获取相应的input表单元素实现聚焦
        this.$refs[index].focus();
      });
    },
    //*删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //*保存按钮事件  添加或修改属性
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName !== "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        const result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        if (result.code == 200) {
          this.getdata();
          this.$message({
            type: "success",
            message: "保存成功",
          });
          this.isShow = true;
        }
      } catch (error) {
        this.$message.error("保存失败");
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
