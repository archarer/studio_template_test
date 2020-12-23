<template>
   <div class='wrap'>
    <input type='checkbox' id='rightSideChecking' style='display:none;' />
    <button class='blob'><i class="fa fa-camera-retro "></i></button>
    <button class='blob'>&#x2709;</button>
    <button class='blob'>&#x2699;</button>
    <label class='blob' for='rightSideChecking'>
    <span class='bar'></span>
    <span class='bar'></span>
    <span class='bar'></span>
    </label>
</div>
</template>
<script>
export default {
  name: 'rightside',
  data() {
    return {
      webIconList: [
      ]
    }
  }
}
</script>
<style scoped>
.bar {
	display: block;
	width: 40px;
	height: 5px;
	margin: 5px auto;
	background-color: #fff;
	border-radius: 2px;
	transition: all .4s linear .1s;
	-webkit-transition: all .4s linear .1s;
	-moz-transition: all .4s linear .1s;
	-o-transition: all .4s linear .1s;
	-ms-transition: all .4s linear .1s
}

.bar:first-child {
	margin-top: 20px
}

.wrap {
  z-index: 100;
	position: fixed;
	bottom: 10px;
	right: -37px;
	margin: auto;
	width: 67px;
	height: 67px;
	-webkit-filter: url(#filt)
}

.wrap .blob {
	display: block;
	cursor: pointer;
	border: 0;
	outline: 0;
	position: absolute;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	z-index: 10;
	background-color: #69cab9;
	box-shadow: 0 0 10px 1px rgba(255,255,255,.3) inset;
	-webkit-box-shadow: 0 0 10px 1px rgba(255,255,255,.3) inset;
	-moz-box-shadow: 0 0 10px 1px rgba(255,255,255,.3) inset;
	-o-box-shadow: 0 0 10px 1px rgba(255,255,255,.3) inset;
	-ms-box-shadow: 0 0 10px 1px rgba(255,255,255,.3) inset
}

.wrap .blob[for=rightSideChecking] {
	z-index: 30;
	font-size: 60px;
	text-align: center;
	color: #fff;
	transition: transform .5s ease-in-out .2s;
	-webkit-transition: -webkit-transform .5s ease-in-out .2s;
	-moz-transition: transform .5s ease-in-out .2s;
	-o-transition: transform .5s ease-in-out .2s;
	-ms-transition: transform .5s ease-in-out .2s
}

.wrap .blob:not([for=rightSideChecking]) {
	width: 50px;
	height: 50px;
	top: 6px;
	left: 6px;
	font-size: 30px;
	transition: all .5s ease-in-out;
	-webkit-transition: all .5s ease-in-out;
	-moz-transition: all .5s ease-in-out;
	-o-transition: all .5s ease-in-out;
	-ms-transition: all .5s ease-in-out
}

.wrap .blob:not([for=rightSideChecking]):hover {
	color: #f44336;
	animation: harlem .5s linear forwards;
	-webkit-animation: harlem .5s linear forwards;
	-moz-animation: harlem .5s linear forwards;
	-o-animation: harlem .5s linear forwards;
	-ms-animation: harlem .5s linear forwards
}

.wrap>#rightSideChecking:checked~.blob:nth-child(2) {
	margin-left: -80px;
  margin-top: 10px;
  border: 1px solid;
	background-color: #fff
}

.wrap>#rightSideChecking:checked~.blob:nth-child(3) {
	margin-top: -44px;
  margin-left: -70px;
  border: 1px solid;
	background-color: #fff
}

.wrap>#rightSideChecking:checked~.blob:nth-child(4) {
	margin-top: -82px;
  margin-left: -30px;
  border: 1px solid;
	background-color: #fff
}

.wrap>#rightSideChecking:checked~.blob[for=rightSideChecking]>.bar:nth-child(1) {
	transform: rotate(45deg);
	-webkit-transform: rotate(45deg);
	-moz-transform: rotate(45deg);
	-o-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	margin-top: 26px
}

.wrap>#rightSideChecking:checked~.blob[for=rightSideChecking]>.bar:nth-child(2) {
	transform: rotate(-45deg);
	-webkit-transform: rotate(-45deg);
	-moz-transform: rotate(-45deg);
	-o-transform: rotate(-45deg);
	-ms-transform: rotate(-45deg);
	margin-top: -10px
}

.wrap>#rightSideChecking:checked~.blob[for=rightSideChecking]>.bar:nth-child(3) {
	opacity: 0
}

@keyframes harlem {
	0% {
		transform: translate(0);
		-webkit-transform: translate(0);
		-moz-transform: translate(0);
		-o-transform: translate(0);
		-ms-transform: translate(0)
	}

	25% {
		transform: translate(5px,5px);
		-webkit-transform: translate(5px,5px);
		-moz-transform: translate(5px,5px);
		-o-transform: translate(5px,5px);
		-ms-transform: translate(5px,5px)
	}

	50% {
		transform: translate(-5px,-5px);
		-webkit-transform: translate(-5px,-5px);
		-moz-transform: translate(-5px,-5px);
		-o-transform: translate(-5px,-5px);
		-ms-transform: translate(-5px,-5px)
	}

	75% {
		transform: translate(2px,2px);
		-webkit-transform: translate(2px,2px);
		-moz-transform: translate(2px,2px);
		-o-transform: translate(2px,2px);
		-ms-transform: translate(2px,2px)
	}

	100% {
		transform: translate(0);
		-webkit-transform: translate(0);
		-moz-transform: translate(0);
		-o-transform: translate(0);
		-ms-transform: translate(0)
	}
}

@-webkit-keyframes harlem {
	0% {
		transform: translate(0);
		-webkit-transform: translate(0);
		-moz-transform: translate(0);
		-o-transform: translate(0);
		-ms-transform: translate(0)
	}

	25% {
		transform: translate(5px,5px);
		-webkit-transform: translate(5px,5px);
		-moz-transform: translate(5px,5px);
		-o-transform: translate(5px,5px);
		-ms-transform: translate(5px,5px)
	}

	50% {
		transform: translate(-5px,-5px);
		-webkit-transform: translate(-5px,-5px);
		-moz-transform: translate(-5px,-5px);
		-o-transform: translate(-5px,-5px);
		-ms-transform: translate(-5px,-5px)
	}

	75% {
		transform: translate(2px,2px);
		-webkit-transform: translate(2px,2px);
		-moz-transform: translate(2px,2px);
		-o-transform: translate(2px,2px);
		-ms-transform: translate(2px,2px)
	}

	100% {
		transform: translate(0);
		-webkit-transform: translate(0);
		-moz-transform: translate(0);
		-o-transform: translate(0);
		-ms-transform: translate(0)
	}
}

.writingshit {
	width: 60%;
	margin: 50px auto;
	background-color: #fff;
	text-align: center;
	box-shadow: 0 0 10px 2px #000;
	-webkit-box-shadow: 0 0 10px 2px #000;
	-moz-box-shadow: 0 0 10px 2px #000;
	-o-box-shadow: 0 0 10px 2px #000;
	-ms-box-shadow: 0 0 10px 2px #000
}

.writingshit .wow {
	padding: 30px
}

.writingshit .wow p {
	padding: 0 30px
}
</style>

