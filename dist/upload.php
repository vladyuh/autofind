<?php
    $imgGetFromJS = $_POST['data'];
    $ps = str_replace('data:image/jpeg;base64,', '', $imgGetFromJS);
    $ps = str_replace('data:image/png;base64,', '', $ps);
    $ps = str_replace(' ', '+', $ps);
    $img = base64_decode($ps);

    //$image_url = 'adress img';
    $upload_dir = $_SERVER['DOCUMENT_ROOT'] . "/uploads";
    $image_data = $img;
    $filename = md5($_POST['file']) . '.jpg';   

    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
        $file = $upload_dir. '/' . $filename;
        file_put_contents($file, $image_data);
    }
    else{
        $file = $upload_dir. '/' . $filename;
        file_put_contents($file, $image_data);
    }   
    

    exit(json_encode([
        'url' => $file,
        'attach_id' => $filename,
    ]));
?>