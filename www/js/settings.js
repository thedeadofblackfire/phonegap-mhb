var app_settings = {  
	'package_name': 'MyHebdoBox',
	'package_id': 'com.robotiktechnology.myhebdobox',
	'push_app': 'eureka_care',
    'push_senderID': '304393421639',
	'api_url': 'https://vendor.eureka-platform.com/api/mobile',
	'api_url_dev': 'http://eureka.vendor/api/mobile',
	'pattern_section': {
		'morning': {'section': 'morning', 'time_code': '0800', 'time_start': '0000', 'time_end': '0900'},
		'noon': {'section': 'noon', 'time_code': '1200', 'time_start': '0900', 'time_end': '1400'},
		'evening': {'section': 'evening', 'time_code': '1900', 'time_start': '1400', 'time_end': '2000'},
		'night': {'section': 'night', 'time_code': '2200', 'time_start': '2000', 'time_end': '2359'},
	},
	'reminder_seconds': 1800
};
