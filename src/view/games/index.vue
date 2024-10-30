<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="" prop="gameName">
        <el-input
          v-model="queryParams.gameName"
          placeholder="请输入游戏包名或名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="versionCode">
        <el-input
          v-model="queryParams.versionCode"
          placeholder="请输入游戏版本号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="onlinePlatformType">
        <el-select v-model="queryParams.onlinePlatformType" placeholder="游戏渠道" clearable>
          <el-option
            v-for="dict in dict.type.game_platform"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['iaa:games:export']"
        >导出</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" v-if="false" >
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['iaa:games:add']"
          v-if="false" 
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['iaa:games:edit']"
          v-if="false" 
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['iaa:games:remove']"
          v-if="false" 
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['iaa:games:export']"
          v-if="false" 
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gamesList" stripe style="width: 100%" max-height="680" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" v-if="false"/>
      <el-table-column label="" align="center" prop="id" v-if="false"/>
      <!-- <el-table-column label="游戏图标" width="100" align="center" prop="gameIcon">
        <template slot-scope="scope">
          <img :src="scope.row.gameIcon" alt="游戏图标" @load="displayIcon(scope.row.gameIcon)" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column> -->

      <el-table-column align="center" width="320" prop="gameName" fixed label="游戏名称">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center;">
            <img :src="scope.row.gameIcon" alt="游戏图标" @load="displayIcon(scope.row.gameIcon)" style="width: 40px; height: 40px; margin-right: 10px;" />
            <span>{{ scope.row.gameName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="上架状态" align="center" prop="onlineType">
        <template slot-scope="scope">
          <el-tag
            v-for="item in onlineTypeList"
            v-if="scope.row.onlineType === item.id"
            :key="item.id"
            :class="getOnlineTagClass(scope.row.onlineType)"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="游戏包名" align="center" prop="packageName"/>
      <el-table-column label="游戏版本名"  align="center" prop="versionName" />
      <el-table-column label="游戏版本号" w align="center" prop="versionCode" />
      <el-table-column label="游戏渠道"  align="center" prop="onlinePlatformType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.game_platform" :value="scope.row.onlinePlatformType"/>
        </template>
      </el-table-column>

      <el-table-column label="审核状态" width="160" align="center" prop="submitType">
        <template slot-scope="scope">
          <el-tag
            v-for="item in submitTypeList"
            v-if="scope.row.submitType === item.id"
            :key="item.id"
            :class="getSubmitTypeTagClass(scope.row.submitType)"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="游戏AppID" width="120" align="center" prop="appId" v-if="false"/>
      <el-table-column label="提交者ID，用于数据报告输出" align="center" prop="publisherId" v-if="false"/>
      <el-table-column label="上架时间" width="120" align="center" prop="onlineTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.onlineTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="false">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['iaa:games:edit']"
            v-if="false"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['iaa:games:remove']"
            v-if="false" 
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改游戏信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="游戏包名" prop="packageName">
          <el-input v-model="form.packageName" placeholder="请输入游戏包名" />
        </el-form-item>
        <el-form-item label="游戏图标" prop="gameIcon" v-if="false" >
          <el-input v-model="form.gameIcon" placeholder="请输入游戏图标" />
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="form.gameName" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="游戏版本名" prop="versionName">
          <el-input v-model="form.versionName" placeholder="请输入游戏版本名" />
        </el-form-item>
        <el-form-item label="游戏版本号" prop="versionCode">
          <el-input v-model="form.versionCode" placeholder="请输入游戏版本号" />
        </el-form-item>
        <el-form-item label="游戏渠道" prop="onlinePlatformType">
          <el-select v-model="form.onlinePlatformType" placeholder="请选择游戏渠道">
            <el-option
              v-for="dict in dict.type.game_platform"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏AppID" prop="appId">
          <el-input v-model="form.appId" placeholder="请输入游戏AppID" />
        </el-form-item>
        <el-form-item label="提交者ID，用于数据报告输出" prop="publisherId" v-if="false" >
          <el-input v-model="form.publisherId" placeholder="请输入提交者ID，用于数据报告输出" />
        </el-form-item>
        <el-form-item label="上架时间" prop="onlineTime">
          <el-date-picker clearable
            v-model="form.onlineTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择上架时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<!-- 上架状态(0:未上架, 1:已上架)  提交版本状态(0:未提交，1:测试中，2：审核中，3:待发布，4:已上架，5:已下架，6：审核不通过，7：已撤回） -->
<style>
  .custom-tag-gray {
    background-color: #E5E5E5; /* 灰色 */
    color: #5C5C5C;
    border-radius: 5px;
    border: 1px solid #CECECE;
  }
  .custom-tag-green {
    background-color: #E2EEE7; /* 绿色 */
    color: #31AB21;
    border-radius: 5px;
    border: 1px solid #C1E6BC;
  }
  .custom-tag-red {
    background-color: #F1E3E9; /* 红色 */
    color: #F3553E;
    border-radius: 5px;
    border: 1px solid #FBC4BB;
  }
  .custom-tag-organge {
    background-color: #FEF1E8; /* 橙色 */
    color: #F37620;
    border-radius: 5px;
    border: 1px solid #FBD5BB;
  }
  .custom-tag-blue {
    background-color: #E8F4FF; /* 蓝色 */
    color: #1890FF;
    border-radius: 5px;
    border: 1px solid #D1E9FF;
  }
</style>

<script>
import { listGames, getGames, delGames, addGames, updateGames } from "@/api/iaa/games";


export default {
  name: "Games",
  dicts: ['game_platform'],
  data() {
    return {
      // 用于存储图标URL
      iconUrl: '' ,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 游戏信息表格数据
      gamesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: 0,
        ids: [],
        pageNum: 1,
        pageSize: 50,
        packageName: null,
        gameIcon: null,
        gameName: null,
        versionName: null,
        versionCode: null,
        onlinePlatformType: null,
        onlineType: null,
        submitType: null,
        appId: null,
        publisherId: null,
        onlineTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      },
      //上架状态(0:未上架, 1:已上架)
      onlineTypeList:[
        { id: 0, name: '未上架' },
        { id: 1, name: '已发布' }
      ],
      //提交版本状态(0:未提交，1:测试中，2：审核中，3:待发布，4:已上架，5:已下架，6：审核不通过，7：已撤回）
      submitTypeList:[
        { id: 0, name: '未提交' },
        { id: 1, name: '测试中' },
        { id: 2, name: '审核中' },
        { id: 3, name: '待发布' },
        { id: 4, name: '已上架' },
        { id: 5, name: '已下架' },
        { id: 6, name: '审核不通过' },
        { id: 7, name: '已撤回' },
        { id: 8, name: '其他' }
      ],
      colorTypeList:[
        { id: 0, name: '#ECF7EB' },
        { id: 1, name: '#31AB21' },
        { id: 2, name: '#ECF7EB' },
        { id: 3, name: '#ECF7EB' },
        { id: 4, name: '#ECF7EB' },
        { id: 5, name: '#ECF7EB' },
        { id: 6, name: '#ECF7EB' }
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询游戏信息列表 */
    getList() {
      this.loading = true;
      listGames(this.queryParams).then(response => {
        this.gamesList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        packageName: null,
        gameIcon: null,
        gameName: null,
        versionName: null,
        versionCode: null,
        onlinePlatformType: null,
        onlineType: null,
        submitType: null,
        appId: null,
        publisherId: null,
        onlineTime: null,
        createTime: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    // this.ids = selection.map(item => item.id)
    handleSelectionChange(selection) {
      this.queryParams.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加游戏信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGames(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGames(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGames(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除游戏信息编号为"' + ids + '"的数据项？').then(function() {
        return delGames(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('iaa/games/export', {
        ...this.queryParams
      }, `games_${new Date().getTime()}.xlsx`)
    },
    
    /** 显示游戏图标 */
    displayIcon(url) {
      this.iconUrl = url; // 将图标URL赋值给组件的状态
    },
    getColorById(id) {
      const colorObj = this.colorTypeList.find(color => color.id === id);
      return colorObj ? colorObj.color : ''; // 返回对应颜色或空字符串
    },
    getTextColorById(id) {
      // 根据id返回不同的文本颜色
      const colorObj = this.colorTypeList.find(color => color.id === id);
      return colorObj ? colorObj.color : ''; // 返回对应颜色或空字符串
    },
    // 提交版本状态(0:未提交，1:测试中，2：审核中，3:待发布，4:已上架，5:已下架，6：审核不通过，7：已撤回）
    getSubmitTypeTagClass(submitType) {
      switch (submitType) {
        case 0:
          return 'custom-tag-gray'; 
        case 1:
          return 'custom-tag-gray';
        case 2:
          return 'custom-tag-organge';
        case 3:
          return 'custom-tag-organge';
        case 4:
          return 'custom-tag-green';
        case 5:
          return 'custom-tag-blue'; 
        case 6:
          return 'custom-tag-red';
        default:
          return 'custom-tag-blue'; 
      }
    },
    // 上架状态(0:未上架, 1:已上架)
    getOnlineTagClass(submitType) {
      switch (submitType) {
        case 0:
          return 'custom-tag-organge';
        case 1:
          return 'custom-tag-green';
        default:
          return 'custom-tag-blue'; 
      }
    }
  }
};
</script>
