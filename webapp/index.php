<!DOCTYPE html>
<html>
<head>
    <?php
    $title = "Rapsodoo-Homework | COVID-19 per-province";
    require_once "header.php";
    ?>

</head>
<body class="hold-transition sidebar-mini sidebar-collapse">
<div class="wrapper">
    <?php require_once "menu.php"; ?>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <div class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1 class="m-0 text-dark">
                            <a class="m-0 text-dark" data-widget="pushmenu" href="#"><i class="fas fa-bars"></i></a>
                            COVID-19 per-province
                        </h1>
                    </div><!-- /.col -->
                    <div class="col-sm-6">
                        <ol class="breadcrumb float-sm-right">
                            <!-- <li class="breadcrumb-item"><a href="#">Home</a></li> -->
                            <li class="breadcrumb-item active">COVID-19 per-province</li>
                        </ol>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <!-- /.content-header -->

        <!-- Main content -->
        <section class="content">
            <div class="container-fluid">
                <div class="row tab">
                    <div class="col-12">
                        <table  id="table" class="table table-striped table-sm table-head-fixed table-bordered table-hover">
                        </table>

                        <!-- TODO: user or not the loader? -->
                        <!--
                        <div id="WAIT">
                            <div style="margin-top:100px;" class="loader"></div>
                        </div>
                        -->
                    </div>
                </div>
            </div><!-- /.container-fluid -->
        </section>
        <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->
    <?php include "footer.php"; ?>
    <!-- /.control-sidebar -->
</div>
<!-- ./wrapper -->

<!-- JS -->
<?php
require_once('javascript.html');
$selected = basename($_SERVER['PHP_SELF']);
$selected = substr($selected,0,strpos($selected,'.'));
?>
<script src="dist/js/pages/<?= $selected ?>.js?ver=<?= filemtime('dist/js/pages/' . $selected . '.js'); ?>"></script>

</body>
</html>