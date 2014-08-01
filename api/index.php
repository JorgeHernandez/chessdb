<?php
require 'Slim/Slim.php';

$app = new Slim();

$app->get('/games','getGames');

$app->post('/games','addGame');
$app->put('/games/:game_id','updateGame');
$app->delete('/games/:game_id','deleteGame');

$app->get('/moves/:game_id','getMoves');
$app->post('/moves','addMove');
$app->put('/moves/:mov_id','updateMove');
$app->delete('/moves/:mov_id','deleteMove');


$app->post('/user','addUser');
$app->put('/user/:user_id','updateUser');
$app->delete('/user/:user_id','deleteUser');

$app->get('/auth','authenticateUser');

$app->run();


function getGames(){
    $sql = "SELECT * FROM games ORDER BY game_date";
    try {
        $db    = getConnection();
        $stmt  = $db->query($sql);  
        $games = $stmt->fetchAll();
        $db    = null;
        echo json_encode($games);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function addGame(){
    $request = Slim::getInstance()->request();
    $game    = json_decode($request->getBody());
    $sql     = "INSERT INTO games (game_date, game_white, game_black, game_opening, game_result, game_synopsis) VALUES (:game_date, :game_white, :game_black, :game_opening, :game_result, :game_synopsis)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("game_date",     $game->game_date);
        $stmt->bindParam("game_white",    $game->game_white);
        $stmt->bindParam("game_black",    $game->game_black);
        $stmt->bindParam("game_opening",  $game->game_opening);
        $stmt->bindParam("game_result",   $game->game_result);
        $stmt->bindParam("game_synopsis", $game->game_synopsis);
        $stmt->execute();
        $game->game_id = $db->lastInsertId();
        $db = null;
        echo json_encode($game); 
    } catch(PDOException $e) {
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function updateGame(){
    $request = Slim::getInstance()->request();
    $body    = $request->getBody();
    $game    = json_decode($body);
    $sql     = "UPDATE games SET game_date=:game_date, game_white=:game_white, game_black=:game_black, game_opening=:game_opening, game_result=:game_result, game_synopsis=:game_synopsis WHERE game_id=:game_id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("game_date",     $game->game_date);
        $stmt->bindParam("game_white",    $game->game_white);
        $stmt->bindParam("game_black",    $game->game_black);
        $stmt->bindParam("game_opening",  $game->game_opening);
        $stmt->bindParam("game_result",   $game->game_result);
        $stmt->bindParam("game_synopsis", $game->game_synopsis);
        $stmt->execute();
        $db = null;
        echo json_encode($game); 
    } catch(PDOException $e) {
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function deleteGame(){
    $request = Slim::getInstance()->request();
    $game    = json_decode($request->getBody());
    $db->beginTransaction();
    try {
        $sql = "DELETE FROM movements WHERE game_id=:game_id";
        $stmt->bindParam("game_id", $game->game_id);
        $stmt->execute();

        $sql = "DELETE FROM games WHERE game_id=:game_id";
        $stmt->bindParam("game_id", $game_id);
        $stmt->execute();
        $db->commit();
        $db = null;
    } catch(PDOException $e) {
        $db->rollBack();
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function getMoves($game_id){
    $request = Slim::getInstance()->request();
    $mov    = json_decode($request->getBody());
    $sql     = "SELECT * FROM movements WHERE game_id=:game_id ORDER BY mov_order";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("game_id", $mov->game_id);
        $stmt->execute();
        $moves = $stmt->fetchObject();  
        $db = null;
        echo json_encode($moves); 
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function addMove(){
    $request = Slim::getInstance()->request();
    $mov    = json_decode($request->getBody());
    $sql     = "INSERT INTO movements (game_id,mov_order,mov_white,mov_black,mov_board_white,mov_board_black) VALUES (:game_id, :mov_order, :mov_white, :mov_black, :mov_board_white, :mov_board_black)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("game_id",         $mov->game_id);
        $stmt->bindParam("mov_order",       $mov->mov_order);
        $stmt->bindParam("mov_white",       $mov->mov_white);
        $stmt->bindParam("mov_black",       $mov->mov_black);
        $stmt->bindParam("mov_board_white", $mov->mov_board_white);
        $stmt->bindParam("mov_board_black", $mov->mov_board_black);
        $stmt->execute();
        $move->mov_id = $db->lastInsertId();
        $db = null;
        echo json_encode($mov); 
    } catch(PDOException $e) {
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }

}

function updateMove(){
    $request = Slim::getInstance()->request();
    $mov     = json_decode($request->getBody());
    $sql     = "UPDATE movements SET game_id=:game_id, mov_order=:mov_order, mov_white=:mov_white, mov_black=:mov_black, mov_board_white=:mov_board_white, mov_board_black=:mov_board_black WHERE mov_id=:mov_id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("game_id",         $mov->game_id);
        $stmt->bindParam("mov_order",       $mov->mov_order);
        $stmt->bindParam("mov_white",       $mov->mov_white);
        $stmt->bindParam("mov_black",       $mov->mov_black);
        $stmt->bindParam("mov_board_white", $mov->mov_board_white);
        $stmt->bindParam("mov_board_black", $mov->mov_board_black);
        $stmt->execute();
        $db = null;
        echo json_encode($mov); 
    } catch(PDOException $e) {
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function deleteMove(){
    $request = Slim::getInstance()->request();
    $mov     = json_decode($request->getBody());
    try {
        $sql = "DELETE FROM movements WHERE mov_id=:mov_id";
        $stmt->bindParam("game_id", $mov->game_id);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}


function addUser(){
    $request = Slim::getInstance()->request();
    $user    = json_decode($request->getBody());
    $sql     = "INSERT INTO users (user_name, user_password, user_role) VALUES (:user_name, :user_password, :user_role)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("user_name",     $user->user_name);
        $stmt->bindParam("user_password", $user->user_password);
        $stmt->bindParam("user_role",     $user->user_role);
        $stmt->execute();
        $user->user_id = $db->lastInsertId();
        $db = null;
        echo json_encode($user); 
    } catch(PDOException $e) {
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function updateUser(){
    $request = Slim::getInstance()->request();
    $user    = json_decode($request->getBody());
    $sql     = "UPDATE users SET user_name=:user_name, user_password=:user_password, user_role=:user_role  WHERE user_id=:user_id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("user_name",     $user->user_name);
        $stmt->bindParam("user_password", $user->user_password);
        $stmt->bindParam("user_role",     $user->user_role);
        $stmt->execute();
        $db = null;
        echo json_encode($user); 
    } catch(PDOException $e) {
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function deleteUser(){
    $request = Slim::getInstance()->request();
    $user    = json_decode($request->getBody());
    try {
        $sql = "DELETE FROM users WHERE user_id=:user_id";
        $stmt->bindParam("user_id", $user->user_id);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}


function authenticateUser(){
    $request = Slim::getInstance()->request();
    $user    = json_decode($request->getBody());
    $sql     = "SELECT * FROM users WHERE user_name=:user_name AND user_password=:user_password";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("user_name",     $user->user_name);
        $stmt->bindParam("user_password", md5($user->user_password));
        $stmt->execute();
        $moves = $stmt->fetchObject();  
        $db = null;
        echo json_encode($moves); 
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}


function getConnection() {
    $dbhost = "127.0.0.1";
    $dbuser = "root";
    $dbpass = "";
    $dbname = "chessdb";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

?>