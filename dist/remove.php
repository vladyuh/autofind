<?php
    $attachment_id = $_POST['id'];
    $upload_dir = $_SERVER['DOCUMENT_ROOT'] . "/uploads";
    unlink($upload_dir . "/" . $attachment_id);
?>