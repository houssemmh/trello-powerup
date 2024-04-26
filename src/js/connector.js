import { defaultUnitForLocale, celsiusToFahrenheit, kphToMph } from './modules/util';
import fetchWeatherData from './modules/api';
import getConditionKey from './modules/conditions-map';
import localizationSettings from './modules/localizationSettings';

const { Promise } = window.TrelloPowerUp;

const REFRESH_INTERVAL = 1800; // 30 minutes in seconds

console.log("money")

// const showBadge = (command, type, prefs) => {
//   if (command === 'card-badges') {
//     return prefs[`${type}-front`] !== false;
//   }
//   if (command === 'card-detail-badges') {
//     return prefs[`${type}-back`] !== false;
//   }

//   throw new Error('Unknown command', command);
// };

// const getWeatherBadges = (t, opts) =>
//   Promise.all([
//     t.card('coordinates'),
//     t.get('member', 'private', 'units', defaultUnitForLocale(opts.locale)),
//     t.get('board', 'shared'),
//   ]).then(([card, units, prefs]) => {
//     if (!card.coordinates) {
//       // if the card doesn't have a location at all, we won't show any badges
//       return [];
//     }

//     const tempBadge = {
//       dynamic(trello) {
//         return fetchWeatherData(trello).then((weatherData) => {
//           let { temp } = weatherData;
//           if (units === 'metric') {
//             temp = `${temp.toFixed()} °C`;
//           } else {
//             temp = `${celsiusToFahrenheit(temp).toFixed()} °F`;
//           }
//           return {
//             title: trello.localizeKey('temperature'),
//             text: temp,
//             refresh: REFRESH_INTERVAL,
//           };
//         });
//       },
//     };

//     const windBadge = {
//       dynamic(trello) {
//         return fetchWeatherData(trello).then((weatherData) => {
//           let windSpeed = weatherData.wind;
//           if (units === 'metric') {
//             windSpeed = `🌬️ ${windSpeed.toFixed()} kph`;
//           } else {
//             windSpeed = `🌬️ ${kphToMph(windSpeed).toFixed()} mph`;
//           }
//           return {
//             title: trello.localizeKey('wind-speed'),
//             text: windSpeed,
//             refresh: REFRESH_INTERVAL,
//           };
//         });
//       },
//     };

//     const conditionsBadge = {
//       dynamic(trello) {
//         return fetchWeatherData(trello).then((weatherData) => {
//           const conditionKey = getConditionKey(weatherData.conditions);
//           return {
//             title: trello.localizeKey('conditions'),
//             icon: `https://openweathermap.org/img/w/${weatherData.icon}.png`,
//             text: conditionKey ? trello.localizeKey(conditionKey) : '',
//             refresh: REFRESH_INTERVAL,
//           };
//         });
//       },
//     };

//     let badges = [];

//     if (!prefs || typeof prefs !== 'object') {
//       // default to all badges
//       badges = [tempBadge, windBadge, conditionsBadge];
//     } else {
//       // there are some potential preferences
//       [
//         ['temp', tempBadge],
//         ['wind', windBadge],
//         ['conditions', conditionsBadge],
//       ].forEach(([type, badge]) => {
//         if (showBadge(t.getContext().command, type, prefs)) {
//           badges.push(badge);
//         }
//       });
//     }

//     return badges;
//   });


window.TrelloPowerUp.initialize({
  'card-badges': function(t, options) {
    return t.card('all').then(function(card) {
      console.log("card ",card.name)
      return t.get(card.id, 'shared', 'previousDates', { start: null, due: null })
        .then(function(previousDates) {
          // Check for changes in the start and due dates
          const startChanged = card.start !== previousDates.start;
          const dueChanged = card.due !== previousDates.due;

          // Log changes if any
          if (startChanged || dueChanged) {
            console.log(`"${card.id}" "${card.name}": Date changed from ${previousDates.start} - ${previousDates.due} to ${card.start} - ${card.due}`);
          }

          // Update stored dates
          t.set(card.id, 'shared', 'previousDates', { start: card.start, due: card.due });

          return [];
        });
    });
  }
}, {
  refresh: true
});
