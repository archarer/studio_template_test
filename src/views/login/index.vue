<template>
  <div class="login-container">
    <el-form
      class="login-form"
      autoComplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
    >
      <div class="title-container">
        <div
          class="title"
          :style="{backgroundImage: 'url(' + (login_logo ? login_logo : '/static/img/loginTitle.png') + ')'}"
        ></div>
      </div>

      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <i class="fa fa-user-circle" style="color: #fff"></i>
        </span>
        <el-input
          name="username"
          auto-complete="new-password"
          type="text"
          v-model="loginForm.username"
          placeholder="账号"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i
            class="fa fa-lock fa-lg"
            style="font-size: 26px; margin-left: 2px; color: #fff"
          ></i>
        </span>
        <el-input
          name="password"
          auto-complete="new-password"
          :type="passwordType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          placeholder="密码"
        />
      </el-form-item>
      <el-form-item style="border: 0px">
        <div id="captcha"></div>
        <p id="wait" class="show" v-if="!hasLoadCaptcha">
          正在加载验证码......
        </p>
      </el-form-item>
      <el-button
        type="primary"
        style="
          width: 100%;
          margin-bottom: 30px;
          border-color: #69cab9;
          background-color: #69cab9;
        "
        :loading="loading"
        @click.native.prevent="handleLogin"
        :disabled="loginButtonDisabled"
        >登录</el-button
      >
    </el-form>
    <vue-particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="star"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      :style="{backgroundImage: 'url(' +  (login_background ? login_background : '/static/img/loginBackground.jpg') + ')'}"
      class="backgroundContain"
    >
    </vue-particles>
  </div>
</template>
<script>
import request from "@/utils/request";
import "@/utils/geetest.js";
import { isvalidUsername } from "@/utils/validate";
const doc = document
export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入您的账号！"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入6位密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        challenge: "",
        validate: "",
        seccode: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      hasLoadCaptcha: false,
      loginButtonDisabled: false,
      login_background: '',
      login_logo: ''
    };
  },
  created() {
    this.geetest();
    request({
      url: window.Global.POWER_API + "/settings/base",
      method: "get",
    }).then((response) => {
      if (response.data.Data) {
        const {login_logo, login_background, title} = response.data.Data
        this.$store.dispatch('setBaseInfo', response.data.Data)
        this.login_background = login_background
        this.login_logo = login_logo
        doc.title = title ? title : 'Seven_Studio'
      }
    }).catch(e => {
      
    });
  },
  methods: {
    geetest() {
      var _this = this;
      _this.hasLoadCaptcha = false;
      this.loginForm.challenge = "";
      this.loginForm.validate = "";
      this.loginForm.seccode = "";
      request({
        url: window.Global.POWER_API + "/Core/GetGeetestCode",
        method: "get",
      }).then((response) => {
        if (response.data.ResultCode !== "0") {
          _this.$message.error("极验验证初始化失败");
          return;
        }
        var res = JSON.parse(response.data.Data);
        _this.initGeetest(res);
      });
    },
    initGeetest(res) {
      var _this = this;
      window.initGeetest(
        {
          gt: res.gt,
          challenge: res.challenge,
          product: "embed",
          offline: !res.success,
          new_captcha: true,
        },
        function (captchaObj) {
          document.getElementById("captcha").innerHTML = "";
          captchaObj.appendTo("#captcha");
          _this.hasLoadCaptcha = true;
          captchaObj.onError(function () {
            _this.$message.error("验证出错啦，请刷新重试");
          });
        }
      );
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.loginForm.challenge = document.getElementsByName(
        "geetest_challenge"
      )[0].value;
      this.loginForm.validate = document.getElementsByName(
        "geetest_validate"
      )[0].value;
      this.loginForm.seccode = document.getElementsByName(
        "geetest_seccode"
      )[0].value;
      if (
        this.loginForm.challenge === "" ||
        this.loginForm.validate === "" ||
        this.loginForm.seccode === ""
      ) {
        this.$message.error("请校验验证");
        return;
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("LoginByUsernameGeetest", this.loginForm)
            .then((response) => {
              if (response.data.ResultCode === "0") {
                this.loginButtonDisabled = true;
                this.$router.push({ path: "/" });
              } else {
                this.geetest();
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
              this.geetest();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.geetest_holder {
  width: 100% !important;
}
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.title {
  background-image: url(../../images/loginLogo.png);
  height: 72px;
  margin-bottom: 0px;
  background-size: contain;
  background-repeat: no-repeat;
}
.backgroundContain {
  background-image: url(../../images/loginTheme/default.jpg);
  background-size: cover;
  width: 100%;
  height: 100%;
}
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
