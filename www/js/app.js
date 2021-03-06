var ENV = 'production';
var ENV_TARGET = 'phonegap'; // html5, phonegap
if (window.location.hostname == 'eboxsmart.phonegap.local' || window.location.port == '3000') {
    ENV = 'dev';
	ENV_TARGET = 'html5';
	app_settings.api_url = app_settings.api_url_dev;
}

var objUser = {};
var audioEnable = true;
var doRefresh = true;

var baseLanguage = 'en';        

var objConfig = {
   'version': '1.0.0',
   'build': "1832",
   'release_time': '2016.12.01 11:00',
   'platform': 'Android'
};

// INIT SETTING: config
var dbAppUserSettings = dbAppUserSettings || fwkStore.DB("user_settings");
var objUserSettings = {}; 

var app = {
    // Application Constructor
    initialize: function() {
        
        app.treatments.init();
        
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
                  
        if (ENV == 'dev') {
            /*
            jQuery(document).ready(function($){	
               
                // Adjust canvas size when browser resizes
                $(window).resize( app.treatments.respondPill );

                // Adjust the canvas size when the document has loaded.
                app.treatments.respondPill();
            });
            */
        
            ln.init();        
            baseLanguage = ln.language.code;
                
            initFramework();
               
            //var a = app.date.formatDateToTimestamp('2014-05-07 09:40:00');
            //console.log(a);
        
            // get automatically user from session
            objUser = window.localStorage.getItem('user');
			//objUser = window.sessionStorage.getItem('user');
            
            if (objUser) {
                objUser = JSON.parse(objUser);	
                console.log('retrieved user: ', objUser);
                            
            } else {
                objUser = {};
            }                     
                                            
            if (Object.keys(objUser).length == 0) {                           
				var result = app.auth.checkPreAuth(false); 
                if (!result) return;
            } 
			
			// set a device serial
			window.localStorage["device_serial"] = 'ECS1408100003';
      
            initAfterLogin();			
        }
		        
		//document.addEventListener('load', this.onDeviceReady, true);		
    },
    // deviceready Event Handler
    getPhoneGapPath: function () {
        'use strict';
        var path = window.location.pathname;
        var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
        return phoneGapPath;
        	
        // iOS: /var/mobile/Applications/{GUID}/{appName}/www/

        //Android: /android_asset/www/
    },
    onDeviceReady: function() {	
		console.log('onDeviceReady');
                 
        // translation init
        ln.init();        
        baseLanguage = ln.language.code;
        
        app.treatments.localNotificationInit();
				
        if (ENV == 'production') {
            // hide the status bar using the StatusBar plugin
            //StatusBar.hide();
        
            objConfig.platform = device.platform;
            
            /*
            var iOS7 = window.device && window.device.platform && window.device.platform.toLowerCase() == "ios" && parseFloat(window.device.version) >= 7.0;
            if (iOS7) {
                $('body').addClass('iOS7');
                //document.body.style.marginTop = "20px";
            }    
            */
    
            initFramework();
                        
            objUser = window.localStorage.getItem('user');
			//objUser = window.sessionStorage.getItem('user');
            if (objUser) {
                objUser = JSON.parse(objUser);	
                console.log('retrieved user: ', objUser);
                            
            } else {
                objUser = {};
            }                     
            
            if (Object.keys(objUser).length == 0) {           
				var result = app.auth.checkPreAuth(false); 
                if (!result) return;
            } 
            
            initAfterLogin();	            
        }
                        
        
        document.addEventListener("offline", this.onOffline, false);
        document.addEventListener("online", this.onOnline, false);
        
        // save device info the first time for mobile's ower (device uuid)
        // http://docs.phonegap.com/en/3.2.0/cordova_device_device.md.html#Device
    },
    onOffline: function() {
        // Handle the offline event
		console.log('listen offline');
    },
    onOnline: function() {
        // Handle the online event
		console.log('listen online');
		
		app.treatments.load(true);
	  
		app.prescription.load(true);
    },
	checkConnection: function() {
		var networkState = navigator.connection.type;

		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';

		console.log('Connection type: ' + states[networkState]);
		if (networkState !== Connection.NONE) return true;
		else return false;
	}
};

// --
// functions
// --

function initAfterLogin() {
  console.log('initAfterLogin');
  doRefresh = true;
                     		
  //language
  $('#selectlanguage').val(baseLanguage);                        
  $('body').i18n();
  
  // get last prescriptions list
  if (Object.keys(objUser).length > 0) {
	  app.treatments.load(true);
	  
	  app.prescription.load(true);
  }
        
}

function alertDismissed() {
    // do something
}

    /* 
     * mobile framework - Change Page
     * pageid = test.html or #changePage
     */
    function mofChangePage(pageid, options) {
        console.log('mofChangePage '+pageid);
        mainView.loadPage(pageid);
        //$('body').i18n();
    }
	
    /* 
     * mobile framework - Show/hide loading page
     * show: true/false
     */
    function mofLoading(show) {
        console.log('loading '+show); 
        if (show) fw7.showPreloader();
        else fw7.hidePreloader();               
    }
	   
    /* 
     * mobile framework - Show/hide loading page
     * show: true/false
     */
    function mofAlert(message, title) {
        if (title == undefined) title = app_settings.package_name || 'Alert';
        fw7.alert(message, title);               
    }
    
    function mofProcessBtn(id, state) {
        if (state) {
            //$(id).addClass("ui-state-disabled");
            $(id).attr("disabled", "true");
            //$(id).html('processing...');
        } else {
            //$(id).removeClass("ui-state-disabled");
            $(id).removeAttr("disabled");
        }
    }
	

//------
            
jQuery(document).ready(function($){
		        
	$(document).on('click', '.btn-logout', app.auth.handleLogout);

	$(document).on('click', "#btnLogin", app.auth.handleLoginForm);
    
    $(document).on('change', '#selectlanguage', function(e) {		
        var current_status = $(this).val();
        console.log('selectlanguage '+current_status);
        //alert(current_status);
        //displayLanguage();
       
        i18n.setLng(current_status, function(t) {      
            baseLanguage = current_status;
            app.date.initTranslate();
            $('body').i18n();
        });
        //lang.set(current_status);
	});
	    
	/*	
    $(document).on('change', '#toggleswitchnotification', function(e) {		      
       var current_status = 'Off'; //$(this).val();
       if ($(this).is(':checked') === true) current_status = 'On';
       
       app.auth.handleUpdateNotification(current_status);
	       		
	});
	*/
	
});


/* ---------------------- */
// FRAMEWORK 7 
/* ---------------------- */

var fw7;
var $$;
var mainView;
var router = {};

/**
 * Init router, that handle page events
 */
router.init = function() {
		$(document).on('pageBeforeInit', function (e) {
			var page = e.detail.page;
			load(page.name, page.query);
		});
    }

/**
 * Load (or reload) controller from js code (another controller) - call it's init function
 * @param controllerName
 * @param query
 */
 /*
router.load = function(controllerName, query) {
		require(['js/' + controllerName + '/'+ controllerName + 'Controller'], function(controller) {
			controller.init(query);
		});
	}
*/
    
function initFramework() {

    app.date.initTranslate();

    fw7 = new Framework7({
        fastClicks : true,
        cache: false,
        cacheDuration: 1000,
        swipePanel: 'left',
        swipePanelActiveArea: 30,
		modalTitle: 'MyhebdoBox',
        animateNavBackIcon: true,
		init: false //Disable App's automatica initialization
    });
	
    // Expose Internal DOM library
    $$ = Dom7; //Framework7.$;
    
    mainView = fw7.addView('.view-main', {
        // Because we use fixed-through navbar we can enable dynamic navbar
        dynamicNavbar: false,
		//domCache: true
    });
    
    // Events for specific pages when it initialized
	/*
    $$(document).on('pageInit', function (e) {
		console.log(e);
		console.log('pageinit');
	});
	*/
	/*
	fw7.onPageInit('index', function (page) {
	  console.log('index initialized');
	  console.log(page);
	});
	*/	 
 
    $$(document).on('pageBeforeInit', function (e) {
		//console.log(e);
        var page = e.detail.page;
        console.log('PAGE '+page.name);
        // handle index loader
        if (page.name === 'index' || page.name === 'index.html') {			
            // to prevent back url on login  
			
            if (Object.keys(objUser).length == 0) {        
               var result = app.auth.checkPreAuth(false);

			   app.treatments.displayPageHome(page);
				
               if (!result) return;
            }                 
           
            initAfterLogin();  
			
			app.treatments.displayPageHome(page);			
        }
        
        if (page.name === 'login') {
            console.log('login.html pageinit'); 
            //alert('login');
            if (Object.keys(objUser).length == 0) {
                doRefresh = false;
            }
  
        }
               

        if (page.name === 'profile') {       
            //mainView.loadPage('frames/profile.html');       
			/*				
			var data = {};   
			data.objUser = objUser;

			var content = $$(page.container).find('.page-content').html();       
			content = fwk.render(content, data, false);      
			$$(page.container).find('.page-content').html(content);
			
			var navcontent = $$(page.navbarInnerContainer).html();          
			navcontent = fwk.render(navcontent, data, false);      
			$$(page.navbarInnerContainer).html(navcontent);
			*/
			
			if (objUser.lastname) $$('#lastname').val(objUser.lastname);
			if (objUser.firstname) $$('#firstname').val(objUser.firstname);			
			if (objUser.email) $$('#email').val(objUser.email);
			if (objUser.dob) $$('#dob').val(objUser.dob);
			if (objUser.gender) $$('#gender').val(objUser.gender);
        }
		
		if (page.name === 'network') {
			console.log('network page');
			
			var network_pharmacy_description = '';
			if (objUser.office.office_street) network_pharmacy_description += objUser.office.office_street;
			if (objUser.office.office_zip) network_pharmacy_description += ', '+objUser.office.office_zip;
			if (objUser.office.office_city) network_pharmacy_description += ' '+objUser.office.office_city;
			if (objUser.office.office_phone) network_pharmacy_description += '<br/>'+objUser.office.office_phone;
			//if (objUser.office.office_email) network_pharmacy_description += '<br/>'+objUser.office.office_email;
		
			if (objUser.office.office_name) $$('#pharmacy_name').html(objUser.office.office_name);
			if (objUser.office.office_contact) $$('#pharmacy_contact').html(objUser.office.office_contact);
			if (network_pharmacy_description) $$('#pharmacy_description').html(network_pharmacy_description);				
		
			var unknown = 'Non défini dans votre dossier';
			if (objUser.patient_info.doctor_name) $$('#doctor_name').html(objUser.patient_info.doctor_name);
			else $$('#doctor_name').html(unknown);
			if (objUser.patient_info.doctor_phone) $$('#doctor_phone').html(objUser.patient_info.doctor_phone);
		
			if (objUser.patient_info.nurse_name) $$('#nurse_name').html(objUser.patient_info.nurse_name);
			else $$('#nurse_name').html(unknown);
			if (objUser.patient_info.nurse_phone) $$('#nurse_phone').html(objUser.patient_info.nurse_phone);
		
			if (objUser.patient_info.helping_name) $$('#helping_name').html(objUser.patient_info.helping_name);
			else $$('#helping_name').html(unknown);
			if (objUser.patient_info.helping_phone) $$('#helping_phone').html(objUser.patient_info.helping_phone);
		
			/*
			var data = {};   
			data.objUser = objUser;
			data.network_pharmacy_description = '';
			if (objUser.office.office_street) data.network_pharmacy_description += objUser.office.office_street;
			if (objUser.office.office_zip) data.network_pharmacy_description += ', '+objUser.office.office_zip;
			if (objUser.office.office_city) data.network_pharmacy_description += ' '+objUser.office.office_city;
			if (objUser.office.office_phone) data.network_pharmacy_description += '<br/>'+objUser.office.office_phone;
			//if (objUser.office.office_email) data.network_pharmacy_description += '<br/>'+objUser.office.office_email;
		
			var content = $$(page.container).find('.page-content').html();       
			content = fwk.render(content, data, false);      
			$$(page.container).find('.page-content').html(content);
			
			var navcontent = $$(page.navbarInnerContainer).html();          
			navcontent = fwk.render(navcontent, data, false);      
			$$(page.navbarInnerContainer).html(navcontent);			
			*/
			
		}
      

        if (page.name === 'treatments') {                  
       
             app.treatments.displayPageTreatment(page);
 
        }

        if (page.name === 'taking') {                  
       
             app.treatments.displayPageTaking(page);
 
        }

        if (page.name === 'daily_treatment') {                  
       
             app.treatments.displayPageDailyTreatment(page);
 
        }        
        
        if (page.name === 'treatments_report') {                  
       
             app.treatments.displayPageTreatmentReport(page);
 
        }
                  
        
        if (page.name === 'settings') {        
            $$('.reset-local-storage').on("click", function() {
                app.resetLocalStorage();
            });
                
            $$('#selectlanguage').val(baseLanguage);             
            
            $('.page[data-page="settings"] .page-content').html($('.page[data-page="settings"] .page-content').html().replace(/{{version}}/g, objConfig.version).replace(/{{build}}/g, objConfig.build).replace(/{{release_time}}/g, objConfig.release_time));
        
            if (objUserSettings.flashlight) $$('#switch-flashlight').attr( "checked", "checked");       
            if (objUserSettings.vibration) $$('#switch-vibration').attr( "checked", "checked");
            if (objUserSettings.sound) $$('#switch-sound').attr( "checked", "checked"); 
            $$('#audio_volume').val(objUserSettings.audio_volume);    
			            
        }
		
		if (page.name === 'prescription') {        
            $$('.send-prescription').on("click", function() {
				console.log('send-prescription');
				app.prescription.validPagePrescription();
            });                                               
        }
            
        // update translation
        $('.pages').i18n();

    });
    
    // Required for demo popover
    $$('.popover a').on('click', function () {
        fw7.closeModal('.popover');
    });

    // Change statusbar bg when panel opened/closed
    $$('.panel-left').on('open', function () {
        $$('.statusbar-overlay').addClass('with-panel-left');
    });
    $$('.panel-right').on('open', function () {
        $$('.statusbar-overlay').addClass('with-panel-right');
    });
    $$('.panel-left, .panel-right').on('close', function () {
        $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
    });
	
	//And now we initialize app
	fw7.init();
	
	// welcomescreen
	ipc = new app.pages.IndexPageController(fw7, $$);

}

function goMainTab(link) {
	var newTab = $$(link);
    if (newTab.length === 0) return;
    var oldTab = $$('.tabs').find('.tab.active').removeClass('active');
    newTab.addClass('active');
    newTab.trigger('show');
    var clickedParent = $$('.toolbar-inner');
                    
    clickedParent.find('.active').removeClass('active');
    $$('a[href="'+link+'"]').addClass('active');
                    
    if (newTab.find('.navbar').length > 0) {
        // Find tab's view
        var viewContainer;
        if (newTab.hasClass('view')) viewContainer = newTab[0];
        else viewContainer = newTab.parents('.view')[0];
        fw7.sizeNavbars(viewContainer);
    }
                   
}


// -----------
// SETTINGS
// -----------
app.settings = {};

app.settings.init = function()
{
    objUserSettings = dbAppUserSettings.get();
    if (Object.keys(objUserSettings).length == 0) {
       objUserSettings = {  
        'autoconnect': true, 
        'last_update': new Date().toISOString(),     
        };            
       dbAppUserSettings.set(objUserSettings);
    }      
};

app.settings.set = function(key, value)
{
    objUserSettings[key] = value;
    objUserSettings['last_update'] = new Date().toISOString();
    dbAppUserSettings.set(objUserSettings);       
};

app.settings.get = function(key)
{
    return objUserSettings[key];            
};



//------
//  calendar picker 
//-----
/*
var today = new Date();
 
var pickerInline = fw7.picker({
    input: '#picker-date',
    container: '#picker-date-container',
    toolbar: false,
    rotateEffect: true,
 
    value: [today.getMonth(), today.getDate(), today.getFullYear(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],
 
    onChange: function (picker, values, displayValues) {
        var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
        if (values[1] > daysInMonth) {
            picker.cols[1].setValue(daysInMonth);
        }
    },
 
    formatValue: function (p, values, displayValues) {
        return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
    },
 
    cols: [
        // Months
        {
            values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
            displayValues: ('Janvier Février Mars Avril Mai Juin Juillet Aout Septembre Octobre Novembre Decembre').split(' '),
            textAlign: 'left'
        },
        // Days
        {
            values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        },
        // Years
        {
            values: (function () {
                var arr = [];
                for (var i = 1950; i <= 2030; i++) { arr.push(i); }
                return arr;
            })(),
        },
        // Space divider
        {
            divider: true,
            content: '  '
        },
        // Hours
        {
            values: (function () {
                var arr = [];
                for (var i = 0; i <= 23; i++) { arr.push(i); }
                return arr;
            })(),
        },
        // Divider
        {
            divider: true,
            content: ':'
        },
        // Minutes
        {
            values: (function () {
                var arr = [];
                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                return arr;
            })(),
        }
    ]
});                

*/