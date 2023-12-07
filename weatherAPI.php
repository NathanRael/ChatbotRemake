<?php
    require 'src/components/header.php';
?>
<body onload="">
    <div class="btn-previous-container">
        <a href="/mainInterface.php" class="btn-previous"><i class="bi bi-arrow-left"></i></a>     
    </div>
    <p class="floatingInfo">
        Welcomme to the weather mode, please type a country
    </p>
    <ul class="reply-container weatherReplyContainer">
    </ul>

    <form  class="user-input-container bottom-input">
        <input type="text" class="user-input" id="ApiPromptInput" placeholder="Type a country name ..." autocomplete="off">
        <button id="sendApiPrompt" type="submit"><i class="bi bi-arrow-right"></i></button>
    </form>

    <?php require 'src/components/movingPart.php' ?>
    <?php require 'src/components/popup.php' ?>

</body>
</html>