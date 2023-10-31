<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Bukita | Login</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <!-- icheck bootstrap -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/icheck-bootstrap/3.0.1/icheck-bootstrap.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.1.0/css/adminlte.min.css">
    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">

</head>
<style>
    .login-page {
        background-image: url("<?= base_url; ?>/dist/img/bukubg.jpg");
        background-repeat: repeat;
    }
</style>

<body class="hold-transition login-page">

    <div class="login-box">

        <div class="login-logo">
            <img src="<?= base_url; ?>/dist/img/buku.gif" alt="Logo" width="50%" height="50%">
            <p></p>
            <b>Bu</b>Kita
        </div>
        <!-- /.login-logo -->
        <div class=" card">
            <div class="card-body login-card-body">
                <p class="login-box-msg">Silahkan login terlebih dahulu.</p>

                <form action="login/prosesLogin" method="post">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="ketikkan username.." name="username">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-user"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <input type="password" class="form-control" placeholder="ketikkan password.." name="password">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-lock"></span>
                            </div>
                        </div>
                    </div>
                    <style>
                        .row {
                            justify-content: center;
                        }
                    </style>
                    <div class="row">
                        <div class="col-4">
                            <button type="submit" class="btn btn-success btn-block">Sign In</button>
                        </div>
                    </div>
                </form>
            </div>
            <!-- /.login-card-body -->
        </div>
        <div class="row">
            <div class="col-sm-12">
                <!-- Flasher message section - Make sure to replace this PHP block with your server-side implementation -->
            </div>
        </div>
    </div>
    <!-- /.login-box -->




    </script>
    </script>

    <!-- jQuery -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <!-- Bootstrap 4 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <!-- AdminLTE App -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.1.0/js/adminlte.min.js"></script>
</body>

</html>