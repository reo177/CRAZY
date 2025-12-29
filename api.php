<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// 設定ファイルの読み込み
$configFile = 'config.json';

if (!file_exists($configFile)) {
    http_response_code(404);
    echo json_encode(['error' => '設定ファイルが見つかりません']);
    exit;
}

$config = json_decode(file_get_contents($configFile), true);

if ($config === null) {
    http_response_code(500);
    echo json_encode(['error' => '設定ファイルの解析に失敗しました']);
    exit;
}

// リクエストパラメータの取得
$serverId = isset($_GET['server']) ? $_GET['server'] : null;
$action = isset($_GET['action']) ? $_GET['action'] : 'list';

// アクションに応じた処理
switch ($action) {
    case 'list':
        // 全サーバーリストを返す
        echo json_encode($config['servers'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        break;
        
    case 'get':
        // 特定のサーバー情報を返す
        if ($serverId) {
            $server = null;
            foreach ($config['servers'] as $s) {
                if ($s['id'] === $serverId) {
                    $server = $s;
                    break;
                }
            }
            
            if ($server) {
                echo json_encode($server, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'サーバーが見つかりません']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'サーバーIDが指定されていません']);
        }
        break;
        
    case 'config':
        // 全体設定を返す
        echo json_encode($config, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => '無効なアクションです']);
        break;
}
?>

