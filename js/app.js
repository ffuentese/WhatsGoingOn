/* Country List */

function getCountries(country_list, callback){
	// $.getJSON(COUNTRY_LIST,'',callback);
	displayCountries(country_list);
}

function renderCountryList(result){
	return `
	<option value="${result[0]}">${result[1]}</option>
	`;
}

function displayCountries(data){
	var newHtml = '<option>Select a country...</option>'
	var results = data.map(function(item, index){
		return renderCountryList(item);
	});
	$('.js-query-dropdown').html(results);
}

// YouTube local trends

var YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/videos';

function getDataFromApiYT(searchTerm, callback){
	var query = {'key': YT,
				 'maxResults': '12',
                 'part': 'id,snippet',
                 'chart': 'mostPopular',
                 'regionCode': searchTerm,
                 'type': 'video'};
     $.getJSON(YOUTUBE_SEARCH_URL, query, callback);

}

function renderResultYT(result) {
	
  return `
    <div id="video" class="col-4">
      <h3>
      <a class="js-result-name" href="https://www.youtube.com/watch?v=${result.id}" target="_blank">${result.snippet.title}</a> by <a class="js-video-channel" target="_blank" href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank">${result.snippet.channelTitle}</a></h3>
      <p>: <span class="js-thumbnail-video"><a href="https://www.youtube.com/watch?v=${result.id}" target="_blank"><img src="${result.snippet.thumbnails.medium.url}" alt="${result.snippet.title}" class="picture"/></a></span></p>
      
    </div>
  `;
}


function displayQueryResultsYT(data){
	console.log(data);
	var results = data.items.map(function(item, index){
		return renderResultYT(item);
	});
	console.log(results);
	$('.js-youtube-videos').html(results);

}

// Excerpt from Wikipedia

var WIKIPEDIA_URL = 'https://en.wikipedia.org/w/api.php?callback=?';

function getDataFromApiWP(country, callback){
	var query = {
	"action": "query",
	"format": "json",
	"prop": "extracts",
	"titles": country,
	"formatversion": "2",
	"exintro": "1",
	"redirects": "1"
	};
	$.getJSON(WIKIPEDIA_URL, query, callback);
}

function renderResultWP(result) {
	var name = result.title;
	var arr = name.split(' ');
	name = arr.join('_');
	var url = 'http://en.wikipedia.org/wiki/'+name;
	console.log(url);
  return `
    <div id="wikipedia">
      
      <h2>${result.title}</h2>

      <span class="wikipedia-text">
      ${result.extract}
      </span>
      <p><a href="${url}" target="_blank">Read more...</a></p>
      
    </div>
  `;
}

function displayQueryResultsWP(data){
	var results = data.query.pages.map(function(item, index){
		return renderResultWP(item);
	});
	
	$('.js-wikipedia').html(results);

}

// News API

var NEWS_URL = 'https://newsapi.org/v2/everything';

function getDataFromAPINews(country, callback){
	var date = new Date();
	date.setDate(date.getDate() - 7);
	var domains = 'abc.net.au,aljazeera.com,apnews.com,us.cnn.com,economist.com,theguardian.com,nytimes.com,theglobeandmail.com,wsj.com,washingtonpost.com';
	var query = { 'apiKey': NEWS_FEED,
				'q': country + " news",
				'language' : 'en',
				'sortBy': 'relevancy',
				'from' : date.toISOString(),
				'pageSize': 8,
				'domains' : domains
	};
	$.getJSON(NEWS_URL, query, callback);
}

function renderResultNews(result){
	var rd = new Date(result.publishedAt);
	var pubDate = rd.getDate() + "-" + (rd.getMonth()+1) + "-" + rd.getFullYear() + " "
	+ rd.getHours() + ":" + rd.getMinutes();
	return `
		<article class="col-3">
		<div id="news">
			<h3><a href="${result.url}" target="_blank">${result.title}</a></h3>
			 <p>
			 <img src="${result.urlToImage}" alt="${result.title}" class="picture" />
			</p> 
			<p><small>${result.source.name} published ${pubDate}</small></p>
			<p>${result.description}</p>
		</div>
		</article>
	`;
}

function displayQueryResultsNews(data){
	var results = data.articles.map(function(item, index){
		return renderResultNews(item);
	}); 
	$('.js-news-articles').html(results);
}

// Last FM 

var LASTFM_URL = 'http://ws.audioscrobbler.com/2.0/';

function getDataFromApiLastFM(country_code, callback){
	var query = { 'api_key': LAST_FM,
				  'method' : 'geo.gettopartists',
				  'format': 'json',
				  'country': country_code,
				  'limit': 12
	};
	$.getJSON(LASTFM_URL,query,callback);
}

function renderResultLastFM(result){
	console.log(result);
	return `
	<div id="artist" class="col-4">
		<p><a href="${result.url}"><img src="${result.image[3]['#text']}" alt="${result.name}" class="picture"/></a></p>
		<h3><a href="${result.url}">${result.name}</a></h3>
	</div>
	`;
}

function displayQueryResultsLastFM(data){
	var results = data.topartists.artist.map(function(item, index){
		return renderResultLastFM(item);
	});
	$('.js-lastfm-artists').html(results);
}

// Flickr

var FLICKR_URL = 'https://api.flickr.com/services/rest/';

function getDataFromApiFlickr(country, callback){
	var query = { 'api_key' : FLICKR,
				  'method' : 'flickr.photos.search',
				  'tags' : country,
				  'sort' : 'relevance',
				  'format' : 'json',
				   'per_page' : '2',
				  'nojsoncallback' : '1'
	};
	$.getJSON(FLICKR_URL, query, callback);
}

function renderResultFlickr(result){
	console.log(result);
	return `<article class="flickr-picture col-6">
	<p>${result.title}</p>
	<p><a href="https://www.flickr.com/photos/${result.owner}/${result.id}/" title="${result.title}" target="_blank">
	<img src="https://farm${result.farm}.staticflickr.com/${result.server}/${result.id}_${result.secret}.jpg
" alt="${result.title}" class="picture" /></a></p>
</article>
	`;
}

function displayQueryResultsFlickr(data){
	console.log(data);
	var results = data.photos.photo.map(function(item, index){
		return renderResultFlickr(item);
	});
	$('.js-flickr-photos').html(results);
}
// Form handler

function handleCountryForm(){
	$('#myForm').submit(function(event){
		event.preventDefault();
		var queryTarget = $('.js-query-dropdown :selected');
		
		if (queryTarget !== '') {
			var country = queryTarget.text();
			var country_code = queryTarget.val();
			getDataFromApiFlickr(country, displayQueryResultsFlickr);
			getDataFromApiYT(country_code, displayQueryResultsYT);
			getDataFromApiWP(country, displayQueryResultsWP);
			getDataFromAPINews(country, displayQueryResultsNews);
			getDataFromApiLastFM(country, displayQueryResultsLastFM);
			$('.js-flickr h2').text("Pictures from " + country);
			$('.js-news h2').text("News from " + country);
			$('.js-youtube h2').text("Popular videos in " + country);
			$('.js-lastfm h2').text("Popular musicians in " +  country);
			$('div.row').css("border-top","2px solid grey");

		}
	})
}


$(function(){
	getCountries(country_list,displayCountries);
	handleCountryForm();
})