<template>
  <div class="app-container" >
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" 
        style="display: flex; align-items: baseline;">

      <el-form-item label="" prop="icon">
        <svg-icon :icon-class="iconSelectClass" class-name="custom-class" style="width: 25px; height: 25px;  " />
      </el-form-item>

      <el-form-item label="" prop="gameName">
        <el-input
          v-model="queryParams.gameName"
          placeholder="请输入游戏名称或包名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="" prop="submitType" >
        <el-select v-model="queryParams.submitType" placeholder="审核状态" clearable>
          <el-option
            v-for="dict in dict.type.game_submit_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="onlinePlatformType" v-if="false">
        <el-select v-model="queryParams.onlinePlatformType" placeholder="游戏渠道" clearable>
          <el-option
            v-for="dict in dict.type.game_platform"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="versionCode">
        <el-input
          v-model="queryParams.versionCode"
          placeholder="请输入游戏版本号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="sdkVersionCode">
        <el-input
          v-model="queryParams.sdkVersionCode"
          placeholder="请输入SDK版本号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['iaa:gameTactics:add']"
           v-if="false"
        >新增</el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['iaa:gameTactics:edit']"
             v-if="false"
          >修改</el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['iaa:gameTactics:remove']"
             v-if="false"
          >删除</el-button>
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['iaa:gameTactics:export']"
          >导出</el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="syncSchedulTasks"
          >同步</el-button>


      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8"  v-if="false">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['iaa:gameTactics:add']"
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
          v-hasPermi="['iaa:gameTactics:edit']"
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
          v-hasPermi="['iaa:gameTactics:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['iaa:gameTactics:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格斑马纹，固定表头下拉不移动 -->
    <el-table v-loading="loading" :data="gameTacticsList" stripe style="width: 100%" height="880" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55" align="center" v-if="false"/>
      <el-table-column label="游戏包名" width="170" align="center" prop="packageName"  v-if="false"/>
      
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
           (0:关, 1:开) 
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="总广告开关">
              <el-tooltip :content="switchContent(props.row.allAdEnable)" placement="top">
                <el-switch 
                  v-model="props.row.allAdEnable" 
                  :active-value="1" 
                  :inactive-value="0" 
                  :disabled="true"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item label="置顶广告开关">
              <el-tooltip :content="switchContent(props.row.topAdEnable)" placement="top">
                <el-switch 
                  v-model="props.row.topAdEnable" 
                  :active-value="1" 
                  :inactive-value="0" 
                  :disabled="true"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item label="横幅广告开关">
              <el-tooltip :content="switchContent(props.row.bannerAdEnable)" placement="top">
                <el-switch 
                  v-model="props.row.bannerAdEnable" 
                  :active-value="1" 
                  :inactive-value="0" 
                  :disabled="true"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item label="发奖励开关">
              <el-tooltip :content="switchContent(props.row.rewardAdEnable)" placement="top">
                <el-switch 
                  v-model="props.row.rewardAdEnable" 
                  :active-value="1" 
                  :inactive-value="0" 
                  :disabled="true"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item label="横幅距离"><span>{{ props.row.bannerPadding }}</span> </el-form-item>
            <el-form-item label="横幅高度"><span>{{ props.row.bannerHeight }}</span> </el-form-item>
            <el-form-item label="游戏货币数量"> <span>{{ props.row.gameCoin }}</span></el-form-item>
          </el-form>
        </template>
     </el-table-column> -->

      <!-- <el-table-column label="游戏名称" width="150" align="center" prop="gameName" /> -->

      <el-table-column align="center" width="300" prop="gameName" label="游戏名称">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center;">
            <img :src="scope.row.gameIcon" alt="游戏图标" @load="displayIcon(scope.row.gameIcon)" style="width: 40px; height: 40px; margin-right: 10px;" />
            <el-link class="align-left" @click="navigateToGameTacticsList(scope.row.gameId, scope.row.gameName, scope.row.gameIcon, scope.row.packageName)"> {{ scope.row.gameName }}</el-link>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="游戏渠道" align="center" prop="onlinePlatformType"  v-if="false">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.game_platform" :value="scope.row.onlinePlatformType"/>
        </template>
      </el-table-column>
      <el-table-column label="游戏AppID" width="110" align="center" prop="appId" v-if="false"/>

      <el-table-column label="审核状态" width="120" align="center" prop="submitType">
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

      <el-table-column label="最新版本号" width="60" align="center" prop="versionCode"/>
      <el-table-column label="SDK版本号" width="60" align="center" prop="sdkVersionCode"/>

      <!-- <el-table-column label="横幅重启时间" width="110"align="center" prop="bannerLooperTime" />
      <el-table-column label="激励视频间隔时间" width="110" align="center" prop="rewardLooperTime" />
      <el-table-column label="误触广告时间" width="110" align="center" prop="touchLooperTime" />
      <el-table-column label="请求广告间隔时间" width="110" align="center" prop="adIntervalLooperTime"  v-if="false"/>

      <el-table-column label="原生强点次数" width="110" align="center" prop="nativeCount" />
      <el-table-column label="半插屏强点次数" width="110" align="center" prop="insertCount" />
      <el-table-column label="全插屏强点次数" width="110" align="center" prop="fullInsertCount" />
      <el-table-column label="横幅强点次数" width="110" align="center" prop="bannerCount" />
      <el-table-column prop="rewardCount" width="110" align="center" show-overflow-tooltip>
        <template slot="header">
          <el-tooltip
            class="item"
            content="标签名称的解释文字"
            placement="top-start">
            <span>激励视频强点次数</span>
          </el-tooltip>
        </template>
      </el-table-column> -->

      <!-- 动态渲染字段 -->
      <!-- <el-table-column
        v-for="column in configDynamicList"
        :key="column.key"
        :label="column.column"
        :prop="column.key"
        width="110"
        align="center"
        show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <el-tooltip
            class="item"
            :content="column.key"
            placement="top-start">
            <span>{{ parseExpandField(scope.row) }}</span>
          </el-tooltip>
        </template>
      </el-table-column> -->

      <el-table-column
        v-for="column in configDynamicList"
        :key="column.key"
        :label="column.column"
        :prop="column.key"
        width="100"
        align="center">
        <template  slot="header">
          <el-tooltip
            class="item"
            :content="column.tips"
            placement="top-start">
            <span>{{ column.column }}</span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
            {{parseExpandField(scope.row.expandField, column.key) }}
        </template>
      </el-table-column>
    
      <el-table-column label="操作" align="center" width="110" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button
            size="mini"
            type="text"
            @click="navigateToGameTacticsList(scope.row.gameId, scope.row.gameName, scope.row.gameIcon, scope.row.packageName)"
            v-hasPermi="['iaa:gameTactics:edit']"
          >版本管理</el-button>

          <el-button
            size="mini"
            type="text"
            @click="navigateToGameTacticsExclude(scope.row.gameId)"
            v-hasPermi="['iaa:gameTactics:edit']"
          >屏蔽城市管理</el-button>
          
          <!-- <el-button
            size="mini"
            type="text"
            @click="navigateToGameTacticsTouchAd(scope.row.gameId, scope.row.packageName)"
            v-hasPermi="['iaa:gameTactics:edit']"
          >误触块管理</el-button> -->
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

    <!-- 添加或修改游戏策略配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="游戏信息表ID" prop="gameId">
          <el-input v-model="form.gameId" placeholder="请输入游戏信息表ID" />
        </el-form-item>
        <el-form-item label="游戏包名" prop="packageName">
          <el-input v-model="form.packageName" placeholder="请输入游戏包名" />
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="form.gameName" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="游戏上架平台(0:vivo, 1:oppo, 2:xiaomi, 3:huawei, 4:other)" prop="onlinePlatformType">
          <el-select v-model="form.onlinePlatformType" placeholder="请选择游戏上架平台(0:vivo, 1:oppo, 2:xiaomi, 3:huawei, 4:other)">
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
        <el-form-item label="游戏版本号" prop="versionCode">
          <el-input v-model="form.versionCode" placeholder="请输入游戏版本号" />
        </el-form-item>
        <el-form-item label="SDK版本号" prop="sdkVersionCode">
          <el-input v-model="form.sdkVersionCode" placeholder="请输入SDK版本号" />
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
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 13%;
  }
  .el-table .truncate-text-game.align-left {
    text-align: left;
  }
  .align-left {
    text-align: left!important;
  }
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
import { listGameTactics, listGameTacticsNewVersion, getGameTactics, delGameTactics, addGameTactics, updateGameTactics } from "@/api/iaa/gameTactics";
import { syncSchedulTasks } from "@/api/iaa/robotTask";
import { listConfigDynamicGameTactics, getConfigDynamicGameTactics,updateConfigDynamicGameTactics } from "@/api/iaa/configDynamicGameTactics";

export default {
  name: "GameTactics",
  dicts: ['game_platform', 'game_submit_type'],
  data() {
    return {
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
      // 游戏策略配置表格数据
      configDynamicList: [],
      // 游戏策略配置表格数据
      gameTacticsList: [],
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
        gameId: null,
        packageName: null,
        gameName: null,
        onlinePlatformType: 0, //固定游戏渠道查询 (0:vivo, 1:oppo, 2:xiaomi, 3:huawei, 4:other)
        submitType: null,//提交版本状态(0:未提交，1:测试中，2：审核中，3:待发布，4:已上架，5:已下架，6：审核不通过，7：已撤回）
        appId: null,
        versionCode: null,
        sdkVersionCode: null,
        allAdEnable: null,
        topAdEnable: null,
        bannerAdEnable: null,
        bannerLooperTime: null,
        rewardLooperTime: null,
        touchLooperTime: null,
        adIntervalLooperTime: null,
        bannerPadding: null,
        bannerHeight: null,
        nativeCount: null,
        insertCount: null,
        fullInsertCount: null,
        bannerCount: null,
        rewardCount: null,
        gameCoin: null,
      },
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        gameId: [
          { required: true, message: "游戏信息表ID不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  // 动态获取图标
  computed: {
    iconSelectClass() {
      const type = parseInt(this.queryParams.onlinePlatformType);
      switch (type) {
        case 0:
          return 'vivo';
        case 1:
          return 'oppo';
        case 2:
          return 'xiaomi';
        case 3:
          return 'huawei';
        default:
          return 'skill'; // 默认图标
      }
    },
  },
  // 接收路由参数并设置到 queryParams.onlinePlatformType
  mounted() {
    console.log('onlinePlatformType:', this.queryParams.onlinePlatformType);

    this.queryParams.onlinePlatformType = this.$route.query.onlinePlatformType || 0;
    console.log('route:', this.$route.query);
    // 查询游戏策略动态配置字段
    this.getDynamicConfigList();
    
  },
  created() {
    
  },
  methods: {
    /** 查询游戏策略动态配置字段 */
    // {"menuLevel1":[{"key":"bannerLooperTime","tips":"横幅重启时间（单位：毫秒）","order":0,"column":"横幅重启时间","defaultValue":10000,"componentType":"input"},{"key":"rewardLooperTime","tips":"激励视频重启时间（单位：毫秒）","order":1,"column":"激励视频重启时间","defaultValue":10000,"componentType":"input"}],"menuLevel2":[{"key":"insetId","tips":"插屏ID，用于启动时首次显示","order":0,"column":"insetId","insetId":"input","defaultValue":"xxxxx"},{"key":"openLogin","tips":"登录功能是否开启，SDK内部默认开启。1：开启，0：不开启","order":1,"column":"openLogin","insetId":"input","defaultValue":1},{"key":"skipBackTime","tips":"触发模拟点击下载后延后该时间跳回游戏","order":2,"column":"skipBackTime","insetId":"input","defaultValue":50000}]}
    getDynamicConfigList() {
      this.loading = true;
      listConfigDynamicGameTactics(this.queryParams).then(response => {
        const params = response.rows[0];
        console.log("params:" + params);
        const expandFields = JSON.parse(params.expandFields);
        const configDynamicList = expandFields.menuLevel1;
        console.log("configDynamicList:" +configDynamicList);
        // 动态渲染字段 menuLevel1
        this.configDynamicList = configDynamicList;

        this.getList();
      });
    },
    /** 查询游戏最新版本策略配置列表 */
    getList() {
      //this.loading = true;
      listGameTacticsNewVersion(this.queryParams).then(response => {
        this.gameTacticsList = response.rows;

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
        gameId: null,
        packageName: null,
        gameName: null,
        onlinePlatformType: null,
        submitType: null,//提交版本状态(0:未提交，1:测试中，2：审核中，3:待发布，4:已上架，5:已下架，6：审核不通过，7：已撤回）
        appId: null,
        versionCode: null,
        sdkVersionCode: null,
        allAdEnable: null,
        topAdEnable: null,
        bannerAdEnable: null,
        bannerLooperTime: null,
        rewardLooperTime: null,
        touchLooperTime: null,
        adIntervalLooperTime: null,
        bannerPadding: null,
        bannerHeight: null,
        nativeCount: null,
        insertCount: null,
        fullInsertCount: null,
        bannerCount: null,
        rewardCount: null,
        gameCoin: null,
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
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.queryParams.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加游戏策略配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGameTactics(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏策略配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGameTactics(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGameTactics(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除游戏策略配置编号为"' + ids + '"的数据项？').then(function() {
        return delGameTactics(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 定时任务同步按钮操作 */
    syncSchedulTasks() {
      this.loading = true;
      this.$modal.loading("正在同步中...");
      const taskType = 'task_vivo_game_list'
      const num = 2
      syncSchedulTasks(taskType, num)
      .then(response => {
        this.$modal.closeLoading();
        this.$modal.msgSuccess("同步成功");
        this.getList();
      })
      .catch(error => {
        this.$modal.closeLoading();
        this.$modal.msgError("同步失败，稍后重试");
        console.error(error);
        this.loading = false;
      });
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
    /** 导出按钮操作 */
    handleExport() {
      this.download('iaa/gameTactics/export', {
        ...this.queryParams
      }, `gameTactics_${new Date().getTime()}.xlsx`)
    },
    /** 显示游戏图标 */
    displayIcon(url) {
      this.iconUrl = url; // 将图标URL赋值给组件的状态
    },
    switchContent(value) {
      return value === 1 ? '开' : '关';
    },
    updateContent(row, value) {
      row.topAdEnable = value;
      this.$set(row, 'topAdEnable', value); // 确保响应式更新
    },
    //跳转广告策略列表页面，并传参
    navigateToGameTacticsList(gameId, gameName, gameIcon, packageName) {
      if(!gameId || gameId.length === 0){
        this.$message.error(`游戏ID不存在`);
        return; // 终止后续代码执行
      }
      this.$router.push({ path: 'gameTacticsList' , 
        query: {"onlinePlatformType": this.queryParams.onlinePlatformType, "gameId": gameId, "gameName": gameName, 
            "gameIcon": gameIcon, "packageName": packageName} });
    },
    //跳转广告策略屏蔽城市页面，并传参
    navigateToGameTacticsExclude(gameId) {
      if(!gameId || gameId.length === 0){
        this.$message.error(`游戏ID不存在`);
        return; // 终止后续代码执行
      }
      this.$router.push({ path: 'gameTacticsExclude' , 
        query: {"onlinePlatformType": this.queryParams.onlinePlatformType, "gameId": gameId} });
    },
    //解析动态字段数据
    parseExpandField(expandField, key) {
      // console.log("key:" + key);
      // console.log("expandField:" + expandField);

      // 将 expandField 转换为 JSON 对象
      const expandFieldJson = JSON.parse(expandField);
      // console.log("expandFieldJson:", expandFieldJson);
      
      // 使用方括号符号访问对应的值
      const keyValue = expandFieldJson[key]; // 使用 key 变量来动态访问属性
      // console.log("keyValue:" + keyValue);

      return keyValue;
    },
  }
};
</script>
