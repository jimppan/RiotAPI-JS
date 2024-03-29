const Api = require('./api.js');

/**
 * BannedChampion Class
 */
class BannedChampion
{
    constructor(pick_turn = null, 
                champion_id = null,
                team_id = null)
    {
        this.m_iPickTurn = pick_turn;
        this.m_iChampionID = champion_id;
        this.m_iTeamID = team_id;
    }

    /**
     * Get pick turn
     * 
     * @return int
     */
    getPickTurn()
    {
        return this.m_iPickTurn;
    }

    /**
     * Get champion id
     * 
     * @return int
     */
    getChampionID()
    {
        return this.m_iChampionID;
    }

    /**
     * Get team id
     * 
     * @return int
     */
    getTeamID()
    {
        return this.m_iTeamID;
    }
}

/**
 * Participant Class
 */
class Participant
{
    constructor(profile_icon_id = null, 
                champion_id = null,
                summoner_name = null,
                game_customization_objs = null,
                bot = null,
                runes = null, // Perks
                summoner_spell_2_id = null,
                team_id = null,
                summoner_spell_1_id = null,
                summoner_id = null)
    {
        this.m_iProfileIconID = profile_icon_id;
        this.m_iChampionID = champion_id;
        this.m_szSummonerName = summoner_name;
        this.m_GameCustomizationObjects = game_customization_objs;
        this.m_bBot = bot;
        this.m_Runes = runes; // Perks
        this.m_iSummonerSpell2ID = summoner_spell_2_id;
        this.m_iTeamID = team_id;
        this.m_iSummonerSpell1ID = summoner_spell_1_id;
        this.m_szSummonerID = summoner_id;
    }

    /**
     * Get summoner name
     * 
     * @return string
     */
    getName()
    {
        return this.m_szSummonerName;
    }

    /**
     * Get the id of the champion the player is playing
     * 
     * @return int
     */
    getChampionID()
    {
        return this.m_iChampionID;
    }

    /**
     * Returns true if the player is a bot
     * 
     * @return bool
     */
    isBot()
    {
        return this.m_bBot;
    }

    /**
     * Get runes object
     * 
     * @return Runes
     */
    getRunes()
    {
        return this.m_Runes;
    }

    /**
     * Get summoner spell 1 ID
     * 
     * @return int
     */
    getSummonerSpell1()
    {
        return this.m_iSummonerSpell1ID;
    }

    /**
     * Get summoner spell 2 ID
     * 
     * @return int
     */
    getSummonerSpell2()
    {
        return this.m_iSummonerSpell2ID;
    }

    /**
     * Get team id
     * 
     * @return int
     */
    getTeamID()
    {
        return this.m_iTeamID;
    }

    /**
     * Get summoner id
     * 
     * @return string
     */
    getSummonerID()
    {
        return this.m_szSummonerID;
    }
}

/**
 * GameCustomizationObject Class
 */
class GameCustomizationObject
{
    constructor(category = null, 
                content = null)
    {
        this.m_szCategory = category;
        this.m_szContent = content;
    }

    /**
     * Get category
     * 
     * @return string
     */
    getCategory()
    {
        return this.m_szCategory;
    }

    /**
     * Get content
     * 
     * @return string
     */
    getContent()
    {
        return this.m_szContent;
    }
}

/**
 * Runes Class
 */
class Runes
{
    constructor(primary_rune_tree = null,  // Perk Style
                rune_ids = null,
                secondary_rune_tree = null) // Perk sub style
    {
        this.m_iPrimaryRuneTree = primary_rune_tree;
        this.m_RuneIDs = rune_ids;
        this.m_iSecondaryRuneTree = secondary_rune_tree;
    }

    /**
     * Get primary rune tree ID
     * 
     * @return int
     */
    getPrimaryRuneTree()
    {
        return this.m_iPrimaryRuneTree;
    }

    /**
     * Get rune IDs list
     * 
     * @return int[]
     */
    getRuneIDs()
    {
        return this.m_RuneIDs;
    }

    /**
     * Get secondary rune tree ID
     * 
     * @return int
     */
    getSecondaryRuneTree()
    {
        return this.m_iSecondaryRuneTree;
    }
}

/**
 * ActiveGame Class
 */
class ActiveGame
{
    constructor(game_id = null, 
                game_start_time = null,
                platform_id = null,
                game_mode = null,
                map_id = null,
                game_type = null,
                game_queue_config_id = null,
                observer_encryption_key = null,
                participants = null,
                game_length = null,
                banned_champions = null)
    {
        this.m_iGameID = game_id;
        this.m_iGameStartTime = game_start_time;
        this.m_szPlatformID = platform_id;
        this.m_szGameMode = game_mode;
        this.m_iMapID = map_id;
        this.m_szGameType = game_type;
        this.m_iGameQueueConfigID = game_queue_config_id;
        this.m_szObserverKey = observer_encryption_key;
        this.m_Participants = participants;
        this.m_iGameLength = game_length;
        this.m_BannedChampions = banned_champions;
    }

    /**
     * Parses summoner active game JSON data
     *
     * @param json                 json data (string)
     * @return ActiveGame
     */
    static parseActiveGameJSON(json)
    {
        var participants = [];
        var bans = [];

        // FeaturedGames dont store Runes or GameCustomizationObjects

        for(var i = 0; i < json.participants.length; i++)
        {
            var jsonParticipant = json.participants[i];

            // Get player GameCustomizationObjects
            var customObjects = null;
            if(jsonParticipant.gameCustomizationObjects != null)
            {
                customObjects = [];
                for(var j = 0; j < jsonParticipant.gameCustomizationObjects.length; j++)
                {
                    var jsonCustomObj = jsonParticipant.gameCustomizationObjects[j];
                    customObjects.push(new GameCustomizationObject(jsonCustomObj.category, jsonCustomObj.content));    
                }
            }
            
            // Get player Perks (Runes)
            var runes = null;
            if(jsonParticipant.perks != null)
            {
                var jsonRunesObj = jsonParticipant.perks;
                var runeIds = [];
                for(var j = 0; j < jsonRunesObj.perkIds.length; j++)
                {
                    var jsonRuneId = jsonRunesObj.perkIds[j];
                    runeIds.push(jsonRuneId);    
                }
    
                runes = new Runes(jsonRunesObj.perkStyle, runeIds, jsonRunesObj.perkSubStyle);
            }
            

            var participant = new Participant(jsonParticipant.profileIconId,
                                              jsonParticipant.championId,
                                              jsonParticipant.summonerName,
                                              customObjects,
                                              jsonParticipant.bot,
                                              runes,
                                              jsonParticipant.spell2Id,
                                              jsonParticipant.teamId,
                                              jsonParticipant.spell1Id,
                                              jsonParticipant.summonerId!=null?jsonParticipant.summonerId:null);
            participants.push(participant);
        }

        for(var i = 0; i < json.bannedChampions.length; i++)
        {
            var jsonBan = json.bannedChampions[i];
            // Get player champion bans
            var championBan = new BannedChampion(jsonBan.pickTurn,
                                                 jsonBan.championId,
                                                 jsonBan.teamId);
            bans.push(championBan);
        }

        var activeGame = new ActiveGame(json.gameId,
                                        json.gameStartTime,
                                        json.platformId,
                                        json.gameMode,
                                        json.mapId,
                                        json.gameType,
                                        json.gameQueueConfigId,
                                        json.observers.encryptionKey,
                                        participants,
                                        json.gameLength,
                                        bans);

        return activeGame;
    }

    /**
     * Get game id
     * 
     * @return int
     */
    getGameID()
    {
        return this.m_iGameID;
    }

    /**
     * Get game start time
     * 
     * @return int
     */
    getGameStartTime()
    {
        return this.m_iGameStartTime;
    }

    /**
     * Get platform id
     * 
     * @return string
     */
    getPlatformID()
    {
        return this.m_szPlatformID;
    }

    /**
     * Get game mode
     * 
     * @return string
     */
    getGameMode()
    {
        return this.m_szGameMode;
    }

    /**
     * Get map id
     * 
     * @return int
     */
    getMapID()
    {
        return this.m_iMapID;
    }

    /**
     * Get game type
     * 
     * @return string
     */
    getGameType()
    {
        return this.m_szGameType;
    }

    /**
     * Get game queue config id
     * 
     * @return int
     */
    getGameQueueConfigID()
    {
        return this.m_iGameQueueConfigID;
    }

    /**
     * Get observer key
     * 
     * @return string
     */
    getObserverKey()
    {
        return this.m_szObserverKey;
    }

    /**
     * Get participants list
     * 
     * @return Participant[]
     */
    getParticipants()
    {
        return this.m_Participants;
    }

    /**
     * Get game length
     * 
     * @return int
     */
    getGameLength()
    {
        return this.m_iGameLength;
    }

    /**
     * Get banned champions list
     * 
     * @return BannedChampion[]
     */
    getBannedChampions()
    {
        return this.m_BannedChampions;
    }
}

/**
 * FeaturedGames Class
 */
class FeaturedGames
{
    constructor(api_callback = null)
    {
        this.m_iClientRefreshInterval = -1;
        this.m_GameList = [];

        if(api_callback != null)
            this.queryData(api_callback);
    }

    /**
     * Query featured games
     *
     * https://developer.riotgames.com/api-methods/#spectator-v4/GET_getFeaturedGames
     * 
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    queryData(api_callback = null)
    {
        var self = this;
        Api.Request(Api.BuildURL('lol/spectator/v4/featured-games'), 
        function(error, response, body)
        {
            FeaturedGames._featured_games_api_callback(error, response, body, api_callback, self);
        });
    }

    /**
     * Make sure to use summoner.<member> instead of this.<member> in this function
     */
    static _featured_games_api_callback(error, response, body, api_callback, featuredgames)
    {
        var validCall = Api.IsValidApiCall(response.statusCode);
        
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var json = {};
        if(validCall)
        {
            json = JSON.parse(body);
            featuredgames = FeaturedGames.parseFeaturedGamesJSON(json);    
        }

        api_callback(featuredgames, validCall);
    }
    
    static parseFeaturedGamesJSON(json)
    {
        var featuredGames = new FeaturedGames();
        featuredGames.m_iClientRefreshInterval = json.clientRefreshInterval;
        for(var i = 0; i < json.gameList.length; i++)
        {
            var game = ActiveGame.parseActiveGameJSON(json.gameList[i]);
            featuredGames.m_GameList.push(game);
        }
        return featuredGames;
    }

    /**
     * Get client refresh interval
     * 
     * @return int
     */
    getClientRefreshInterval()
    {
        return this.m_iClientRefreshInterval;
    }

    /**
     * Get a list of featured games
     * 
     * @return ActiveGame[]
     */
    getGames()
    {
        return this.m_iClientRefreshInterval;
    }
}

module.exports =
{
    ActiveGame,
    FeaturedGames,
    Participant,
    GameCustomizationObject,
    Runes,
    BannedChampion
};
