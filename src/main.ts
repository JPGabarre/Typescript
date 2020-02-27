//Importarem el request i també les llibreria de jquery  per poder aixi per les consultes amb ajax
import * as request from "request-promise-native";
import * as $ from "jquery";

//Connexió amb la api
(async () => {
  //URLs de la API que utilitzarem
  const urlMain = 'https://api.coinbase.com';
  const ext1 = '/v2/currencies';
  const ext2 = '/v2/exchange-rates?currency=BTC';

  //Aquestes 2 opcions son les 2 direccions de les quals extreurem la informació
  var currencies = {
      uri: urlMain + ext1,
  };
  var exchange = {
    uri: urlMain + ext2,
  };


  //Pasarem les request en format JSON
  var currenciesRes = await request.get(currencies);
  var exchangeRes = await request.get(exchange);
  var bitcoin = JSON.parse(currenciesRes);
  var bitcoinRates = JSON.parse(exchangeRes);

  //Les introduirem en el html que hem creat nosaltres
  for (var i = 0; i < bitcoin.data.length; i++) {
    //Introduirem tots els tipus de bitcoins al options de la pagina web (el desplegable per escollir el tipus de moneda)
    $('#tipusMoneda').append(`<option value="${bitcoin.data[i].id}">
    ${bitcoin.data[i].name }
    </option>`);

    //Amb aquest if farem que la primera convergencia sigui la de euro
    if(bitcoin.data[i].name =="Euro" ){
      console.log(bitcoin.data[i].id);
      console.log(bitcoinRates.data.rates[bitcoin.data[i].id]);
      $('#line').text('1 bitcoin = ');
      $('#firstValue').text(bitcoinRates.data.rates[bitcoin.data[i].id]);
      $('#firstCoin').text(" "+bitcoin.data[i].id);
      $('#tipusMoneda option:eq(Euro)').prop('selected', true)
    }
    
    // click sobre el button get para tener el resultado  entre dos monedas y nos muestra l’equivalencia.
    var submit = document.getElementById('submit');
    submit.addEventListener('click', function () {
      $('#firstLine').remove();
      $('#line2').text('1 bitcoin = ');
      $('#value').text(bitcoinRates.data.rates[$('#tipusMoneda').find("option:selected").attr('value')]);
      $('#coin').text($('#tipusMoneda').find("option:selected").text());   
    });

    //Text per defecte que apareixerà en el input per introduir la quantitat de monedas a calcular
    $('#coinName').text('Euro');

    //Amb el seguent codi guardarem el resultat de la congressio de la moneda
    $(document).on('change', '#tipusMoneda', function() {
      $('#currentCoin').val('0');
      $('#result').text('0');
      $('#coinName').text($('#tipusMoneda').find("option:selected").text());
    });

    //conversión de la moneda
    $("#currentCoin").on("input", function() {
      var numero=$('#currentCoin').val();
      var valor= bitcoinRates.data.rates[$('#tipusMoneda').find("option:selected").attr('value')];
      let res = <any>numero/<any>valor;
      $('#result').text(res);
    });

  }
  
})()