<?php
    require 'src/components/header.php';
?>
    <section class="">
        <div class="main-hero">
            <img src="./src/image/logo.png" alt="" class="main-image">
            <p class="hero-lead"></p>
        </div>
        <div class="prompt-example-container">
            <div class="prompt-example">
                <p>How to print a code in python ?</p>
                <i class="bi bi-caret-right"></i>
            </div>
        </div>
        <form class="user-input-container">
            <input 
                type="text" 
                class="user-input" 
                id="mainPromptInput" 
                placeholder="Type something ..."
                autocomplete="off"
            >
            <button id="sendMainPrompt" type="submit" ><i class="bi bi-arrow-right"></i></button>
        </form>
    </section>
    <section class="bot-customisation">
        <h1 class="customisation-title">Bot customisations</h1>
        <div class="customisation-card-container">
            <div class="customisation-card">
                <div class="customisation-icon">
                    <i class="bi bi-brightness-high"></i>
                </div>
                <div class="text-container">
                    <h2 class="text-container-title">Weather</h2>
                    <p class="customisation-desc">Check the weather in your country</p>
                </div>
                <a href="/weatherAPI.php" class="btn">Try it</a>
            </div>
            <div class="customisation-card">
                <div class="customisation-icon">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="text-container">
                    <h2 class="text-container-title">Problem solver</h2>
                    <p class="customisation-desc">Assist you throughout your work</p>
                </div>
                <a href="/problemSolverInterface.php" class="btn">Try it</a>
            </div>
        </div>
    </section>
    <?php 
    require 'src/components/footer.php'; 
    require 'src/components/movingPart.php';
    require 'src/components/popup.php' ;
    ?>
</body>
</html>