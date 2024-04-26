console.log("money")

window.TrelloPowerUp.initialize({
  'card-badges': function(t, options) {
    return t.card('all').then(function(card) {
      return t.get(card.id, 'shared', 'previousDates', { start: null, due: null } )
        .then(function(previousDates) {
          if (card.start || card.due) {
            setDate(card)
          }

          const startChanged = card.start !== previousDates.start;
          const dueChanged = card.due !== previousDates.due;

          if (startChanged || dueChanged) {
            setDate(card)
          }
          
          t.set(card.id, 'shared', 'previousDates', { start: card.start, due: card.due });

          return [];
        });
    });
  }
}, {
  refresh: true
});



const setDate = (card) => {
  console.log(`"${card.id}" "${card.name}": Current dates ${card.start} - ${card.due}`);
};