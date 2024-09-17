// controllers/americano.js
function generateRounds(formData) {

  const totalPlayers = parseInt(formData.numberOfPlayers);
  const players = formData.players;

  let rounds = [];

  if (totalPlayers === 4) {
      // For 4 players
      rounds = [
          { round: 1, team1: [players[0], players[1]], team2: [players[2], players[3]] },
          { round: 2, team1: [players[0], players[2]], team2: [players[1], players[3]] },
          { round: 3, team1: [players[0], players[3]], team2: [players[1], players[2]] },
      ];
  } else if (totalPlayers === 5) {
      // For 5 players, one player sits out each round
      rounds = [
          { round: 1, team1: [players[0], players[1]], team2: [players[2], players[3]], sitOut: players[4] },
          { round: 2, team1: [players[0], players[2]], team2: [players[1], players[4]], sitOut: players[3] },
          { round: 3, team1: [players[0], players[3]], team2: [players[2], players[4]], sitOut: players[1] },
          { round: 4, team1: [players[1], players[3]], team2: [players[0], players[4]], sitOut: players[2] },
          { round: 5, team1: [players[1], players[2]], team2: [players[3], players[4]], sitOut: players[0] },
      ];
  } else if (totalPlayers === 6) {
      // For 6 players
      rounds = [
          { round: 1, team1: [players[0], players[1]], team2: [players[2], players[3]], team3: [players[4], players[5]] },
          { round: 2, team1: [players[0], players[2]], team2: [players[1], players[4]], team3: [players[3], players[5]] },
          { round: 3, team1: [players[0], players[3]], team2: [players[1], players[5]], team3: [players[2], players[4]] },
          { round: 4, team1: [players[0], players[4]], team2: [players[1], players[3]], team3: [players[2], players[5]] },
          { round: 5, team1: [players[0], players[5]], team2: [players[1], players[2]], team3: [players[3], players[4]] },
      ];
  }

  return {
    title: formData.title,
    isPrivate: formData.isPrivate,
    community: formData.community,
    players: players,
    rounds: rounds
  };
}
  
  // Export the function so it can be used in other files
  module.exports = { generateRounds };