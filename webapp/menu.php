<!-- Main Sidebar Container -->
<aside class="main-sidebar elevation-4 sidebar-dark-primary">
    <!-- Brand Logo -->
    <a href="index.php" class="brand-link navbar-primary">
        <img src="dist/img/icon.png" alt="AdminLTE Logo" class="brand-image" style="opacity: .8">
        <span class="brand-text font-weight-light">R-Homework</span>
    </a>
    <!-- /.brand-link -->
    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column nav-compact nav-child-indent" data-widget="treeview" role="menu" data-accordion="false">
                <?php $selected = basename($_SERVER['PHP_SELF']); ?>
                <li class="nav-item <?= ($selected == 'index.php' ? 'menu-open' : '') ?>">
                    <a href="index.php" class="nav-link"><i class="nav-icon fas fa-chart-pie"></i><p>COVID-19 per-province</p></a>
                </li>
            </ul>
        </nav>
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>
<!-- /.main-sidebar -->