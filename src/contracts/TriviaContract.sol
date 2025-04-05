
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title ChainTrivia
 * @dev Store and retrieve trivia questions, user answers, and track streaks
 */
contract ChainTrivia {
    struct Question {
        string questionText;
        string[] options;
        uint8 correctAnswer;
    }
    
    struct QuestionSet {
        uint256 date;
        uint256[] questionIds;
    }
    
    struct UserStats {
        uint256 currentStreak;
        uint256 bestStreak;
        uint256 totalCorrect;
        uint256 totalAnswered;
        uint256 lastPlayedTimestamp;
    }
    
    address public owner;
    mapping(uint256 => Question) public questions;
    mapping(uint256 => QuestionSet) public dailyQuestionSets;
    mapping(address => UserStats) public userStats;
    mapping(address => mapping(uint256 => bool)) public hasAnsweredQuestion;
    
    uint256 public questionCounter;
    uint256 public currentDay;
    
    event QuestionAdded(uint256 indexed questionId);
    event DailyQuestionsSet(uint256 indexed date, uint256[] questionIds);
    event AnswerSubmitted(address indexed user, uint256 questionId, bool correct);
    event StreakUpdated(address indexed user, uint256 currentStreak, uint256 bestStreak);
    event BadgeAwarded(address indexed user, string badgeType);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        currentDay = block.timestamp / 86400; // Current day since Unix epoch
    }
    
    function addQuestion(
        string memory _questionText,
        string[] memory _options,
        uint8 _correctAnswer
    ) public onlyOwner {
        require(_correctAnswer < _options.length, "Invalid correct answer index");
        
        questionCounter++;
        questions[questionCounter] = Question({
            questionText: _questionText,
            options: _options,
            correctAnswer: _correctAnswer
        });
        
        emit QuestionAdded(questionCounter);
    }
    
    function setDailyQuestions(uint256 date, uint256[] memory _questionIds) public onlyOwner {
        dailyQuestionSets[date] = QuestionSet({
            date: date,
            questionIds: _questionIds
        });
        
        emit DailyQuestionsSet(date, _questionIds);
    }
    
    function getDailyQuestions(uint256 date) public view returns (uint256[] memory) {
        return dailyQuestionSets[date].questionIds;
    }
    
    function getQuestion(uint256 _questionId) public view returns (
        string memory questionText,
        string[] memory options
    ) {
        Question storage q = questions[_questionId];
        return (q.questionText, q.options);
    }
    
    function submitAnswer(uint256 _questionId, uint8 _selectedAnswer) public returns (bool) {
        require(_questionId <= questionCounter, "Question does not exist");
        require(!hasAnsweredQuestion[msg.sender][_questionId], "Already answered this question");
        
        Question storage q = questions[_questionId];
        bool isCorrect = (q.correctAnswer == _selectedAnswer);
        
        // Record that user has answered this question
        hasAnsweredQuestion[msg.sender][_questionId] = true;
        
        // Update user stats
        UserStats storage stats = userStats[msg.sender];
        stats.totalAnswered++;
        
        if (isCorrect) {
            stats.totalCorrect++;
        }
        
        uint256 today = block.timestamp / 86400;
        
        // Check if playing on a consecutive day
        if (stats.lastPlayedTimestamp > 0) {
            uint256 lastPlayedDay = stats.lastPlayedTimestamp / 86400;
            
            if (today == lastPlayedDay + 1) {
                // Consecutive day - increment streak
                stats.currentStreak++;
                if (stats.currentStreak > stats.bestStreak) {
                    stats.bestStreak = stats.currentStreak;
                }
                
                // Award streak badges
                if (stats.currentStreak == 7) {
                    emit BadgeAwarded(msg.sender, "week_streak");
                } else if (stats.currentStreak == 30) {
                    emit BadgeAwarded(msg.sender, "month_streak");
                }
            } else if (today > lastPlayedDay + 1) {
                // Streak broken
                stats.currentStreak = 1;
            }
        } else {
            // First time playing
            stats.currentStreak = 1;
        }
        
        stats.lastPlayedTimestamp = block.timestamp;
        
        emit AnswerSubmitted(msg.sender, _questionId, isCorrect);
        emit StreakUpdated(msg.sender, stats.currentStreak, stats.bestStreak);
        
        // Award badges for perfect scores - would be handled in a batch function in production
        
        return isCorrect;
    }
    
    function getUserStats(address _user) public view returns (
        uint256 currentStreak,
        uint256 bestStreak,
        uint256 totalCorrect,
        uint256 totalAnswered,
        uint256 lastPlayedTimestamp
    ) {
        UserStats storage stats = userStats[_user];
        return (
            stats.currentStreak,
            stats.bestStreak,
            stats.totalCorrect,
            stats.totalAnswered,
            stats.lastPlayedTimestamp
        );
    }
}
