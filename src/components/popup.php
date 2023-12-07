<!-- Components -->
<div class="popup-bg"></div>
    <div class="setting-popup">
        <div class="setting-header">
            <h2 class="setting-header-text">Setting</h2>
            <i class="bi bi-x-lg close-popup"></i>
        </div>
        <div class="setting-body">
            <div class="setting-body-profile">
                <h2 class="setting-title">Profile</h2>
                <div class="setting-input-group">
                    <input type="text" placeholder="UserName">
                    <input type="text" placeholder="Password">
                </div>
                <button class="setting-btn-profile">
                    <i class="bi bi-pencil-square"></i>
                    Edit profile
                </button>
                <div class="line"></div>
            </div>

            <div class="setting-body-other">
                <h1 class="setting-title">Other</h1>
                <div class="clear-history">
                    <p class="clear-history-text">Clear all history</p>
                    <button class=" btn-clear-history" id="clearStorage">
                        <i class="bi bi-trash"></i>
                        Clear
                    </button>
                </div>
                <div class="line"></div>
                <div class="dark-mode">
                    <div class="dark-mode-text">
                        Dark mode
                    </div>
                    <input type="checkbox" name="" id="darkMode" class="btn-dark-mode">
                    <label for="darkMode" class="dark-mode-label">
                        <i class="bi bi-toggle-on"></i>
                    </label>
                </div>
                <div class="line"></div>
            </div>
            
            
        </div>
    </div>
    <div class="history-popup">
        <div class="history-header">
            <h2 class="history-header-text">Hitory</h2>
            <i class="bi bi-x-lg close-popup"></i>
        </div>
        <div class="history-body">
            <div class="history-body-date">
                <h2 class="history-title">Today</h2>    
                <div class="history-date-content">
                    Tell me  more about you ? ......
                </div>
                <div class="history-date-content">
                    Well, can you fix this snippet of 
                    code for me ?
                </div>
            </div>
            
        </div>
        <div class="history-body">
            <div class="history-body-date">
                <h2 class="history-title">Last 7 days</h2>    
                <div class="history-date-content">
                    Tell me  more about you ? ......
                </div>
                <div class="history-date-content">
                    Well, can you fix this snippet of 
                    code for me ?
                </div>  
            </div>
            
        </div>