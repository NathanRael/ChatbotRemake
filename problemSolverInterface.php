<?php
    require 'src/components/header.php';
?>
<body>
    <p class="floatingInfo">
        Welcomme to the chatBot mode, please, type something ...
    </p>
    <div class="btn-previous-container">
        <a href="/mainInterface.php" class="btn-previous"><i class="bi bi-arrow-left"></i></a>     
    </div>
    <div class="waitMessage">
        <p class="waitMessageText">
            Thinking ...
        </p>
    </div>
    <ul class="reply-container probReplyContainer"></ul>

    <form class="user-input-container bottom-input">
        <input type="text" class="user-input" id="probPromptInput" placeholder="Type something ..." autocomplete="off">
        <button id="sendProbPrompt" type="submit"><i class="bi bi-arrow-right"></i></button>
    </form>
    <?php require 'src/components/movingPart.php' ?>
    <?php require 'src/components/popup.php' ?>
    
</body>
</html>