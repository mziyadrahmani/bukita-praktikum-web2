  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <a href="#" class="brand-link">
          <img src="<?= base_url; ?>/dist/img/buku.gif" alt="Logo" width="15%" height="15%">
          <span class="brand-text font-weight-medium">Buku Kita</span>
      </a>

      <!-- Sidebar -->
      <div class="sidebar">
          <!-- Sidebar user (optional) -->
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
              <div class="info">
                  <a href="#" class="d-block"> @ZYDXD</a>
              </div>
          </div>

          <!-- Sidebar Menu -->
          <nav class="mt-2">
              <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                  data-accordion="false">
                  <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
                  <li class="nav-item">
                      <a href="<?= base_url; ?>/home" class="nav-link">
                          <i class="nav-icon fas fa-tachometer-alt"></i>
                          <p>
                              Dashboard
                          </p>
                      </a>
                  </li>
                  <li class="nav-header">Data</li>
                  <li class="nav-item">
                      <a href="<?= base_url; ?>/kategori" class="nav-link">
                          <i class="nav-icon fas fa-th"></i>
                          <p>
                              Kategori
                          </p>
                      </a>
                  </li>
                  <li class="nav-item">
                      <a href="<?= base_url; ?>/buku" class="nav-link">
                          <i class="nav-icon fas fa-th"></i>
                          <p>
                              Buku
                          </p>
                      </a>
                  </li>
                  <li class="nav-item">
                      <a href="<?= base_url; ?>/user" class="nav-link">
                          <i class="nav-icon fas fa-th"></i>
                          <p>
                              User
                          </p>
                      </a>
                  </li>
                  <li class="nav-header">Extra</li>
                  <li class="nav-item">
                      <a href="<?= base_url; ?>/about" class="nav-link">
                          <i class="nav-icon fas fa-th"></i>
                          <p>
                              About Me
                          </p>
                      </a>
                  </li>
              </ul>
          </nav>
          <!-- /.sidebar-menu -->
      </div>
      <!-- /.sidebar -->
  </aside>