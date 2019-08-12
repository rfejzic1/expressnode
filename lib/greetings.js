const greetings = [
    "Hi", "Hello", "Selam", "Bonjour"
];

exports.getRandomGreeting = () => {
    return greetings[Math.floor(Math.random() * greetings.length)];
};