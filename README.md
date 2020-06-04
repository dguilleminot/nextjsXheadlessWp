# NEXTJS W/ HEADLESS WORDPRESS
*Easy snippet of nextjs and headless wordpress association*

## Purposes
- Wordpress as headless CMS,
- Seo-friendly js front end with next.js,
- JWT token authentification,
- Wordpress users management routes.

## Prerequis
- nextjs (https://nextjs.org/)
- wordpress@jwt auth (https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)

## NEXTJS Side installation
As every nodejs project `npm i`. Just don't forget to set `next.config.js` env var with Woocommerce consumerKey/Secret (optionnal) & baseURL for axios instance.


## Functions.php customization
- Install wordpress and plugin jwt auth (https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/).
- (optionnal) Install woo commerce and create authentification key.
- Append this to functions.php


```
/*===========================
JWT SECRET & CUSTOMIZATION
=============================*/
define('JWT_AUTH_SECRET_KEY', 'P4$$PHR4$E');
define('JWT_AUTH_CORS_ENABLE', true);


add_filter('jwt_auth_token_before_dispatch', 'add_user_info_jwt', 10, 2);

function add_user_info_jwt($token, $user) {
  $token['roles'] = $user->roles;
  return $token;
}

/*===========================
DECLARE REGISTER ROUTE
* source : https://wordpress.stackexchange.com/a/302330
=============================*/
add_action('rest_api_init', 'wp_rest_user_endpoints');

function wp_rest_user_endpoints($request) {
  register_rest_route('users', 'register', array(
    'methods' => 'POST',
    'callback' => 'wc_rest_user_endpoint_handler',
  ));
}

function wc_rest_user_endpoint_handler($request = null) {
  $error = new WP_Error();
  $parameters = $request->get_json_params();
  $username = sanitize_text_field($parameters['username']);
  $email = sanitize_text_field($parameters['email']);
  $password = sanitize_text_field($parameters['password']);

  // verify if data setted
  if (empty($username) || empty($password) || empty($email)) {
    $error->add(400, __('Necessary data not available', 'wp-rest-user'));
    return $error;
  }

  // check if data already taken
  $user_id_exist = username_exists($username);
  $user_email_exist = email_exists($email);

  if ($user_id_exist || $user_email_exist) {
    $error->add(406, __("User exists, please try 'Reset Password'", 'wp-rest-user'));
    return $error;
  }

  // create user
  $user_id = wp_create_user($username, $password, $email);
  if (is_wp_error($user_id)) {
    $error->add(500, __('Something went wrong', 'wp-rest-user'));
    return $error;
  }

  // set role
  $user = get_user_by('id', $user_id);
  $user->set_role('subscriber');

  // WooCommerce specific code
  if (class_exists('WooCommerce')) {
    $user->set_role('customer');
  }

  // send token object as response
  $response = getToken($email, $password);
  return new WP_REST_Response($response, 123);
}

/*===========================
RETURNING JWT FROM USERNAME & PASSWORD
* source : https://wordpress.stackexchange.com/a/309820
=============================*/
function getToken($username, $secret) {
  $ch = curl_init();
  $siteUrl = get_site_url();

  curl_setopt($ch, CURLOPT_URL, $siteUrl.'/wp-json/jwt-auth/v1/token?');
  curl_setopt($ch, CURLOPT_POST, 1);

  # credentials here
  curl_setopt($ch, CURLOPT_POSTFIELDS, 'username='.$username.'&password='.$secret);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  $server_output = curl_exec($ch);
  $server_output = json_decode($server_output);

  if (!empty($server_output->token)) {
      curl_close ($ch);
      return $server_output;
  } else {
    $error = new WP_Error();
    $error->add(500, __('JWT error', 'wp-rest-user'));
    return $error;
  }
}
```
