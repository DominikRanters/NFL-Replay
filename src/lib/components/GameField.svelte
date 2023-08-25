<script lang="ts">
	import FootballField from '$lib/fottbal-field.png';
</script>

<div class="field-box h-40 w-full relative">
	<div class="field-box h-40 w-full flex gap-0.5">
		<div class="ten-yard-box" />
		<div class="ten-yard-box" />
		<div class="ten-yard-box" />
		<div class="ten-yard-box" />
		<div class="ten-yard-box" />
		<div class="ten-yard-box" />
		<div class="ten-yard-box" />
		<div class="ten-yard-box" />
		<div class="ten-yard-box" />
		<div class="ten-yard-box" />
	</div>
	<div class="arrow">
		<div class="line" />
		<div class="point" />
	</div>
</div>

<div class="relative">
	<img src={FootballField} alt="field" />
	<div class="arrow">
		<div class="line" />
		<div class="point" />
	</div>
</div>

<style>
	.field-box {
		background-color: white;
	}

	.ten-yard-box {
		background-color: green;
		width: 10%;
	}

	.arrow {
		position: absolute;
		left: 50px;
		width: 210px;
		top: 38%;
	}

	.line {
		margin-top: 14px;
		width: 180px;
		background: blue;
		height: 10px;
		float: left;
	}

	.point {
		width: 0;
		height: 0;
		border-top: 20px solid transparent;
		border-bottom: 20px solid transparent;
		border-left: 30px solid blue;
		float: right;
	}
</style>
