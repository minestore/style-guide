/*!
 * Card Check
 * 
 * A credit card validator and type guesser 
 * 
 * This is the standalone version of CardCheck.
 * It uses the jQuery methods $.extend and $.inArray
 *  
 * For documentation, look in the package you downloaded or go to
 * http://eclarian.com/cardcheck/
 * 
 * NOTE: This is not open source software and you must purchase
 * a license to legally use.
 * 
 * @uses       jQuery
 * @author     Eclarian Dev Team <eclarian@eclarian.com>
 * @copyright  Eclarian LLC
 * @date       November 29, 2011
 * @updated    March 20, 2013
 * @version    2.0.0
 */
(function(w, $) {
    "use strict";

    // CardCheck already loaded or their is a namespace conflict
    if (w.CardCheck) {
        return;
    }

    var // Setup the default properties and a few helper functions
    defaultSettings = {
        cardNumber: null,
        allowSpaces: true,
        acceptedCards:  [
            'visa',
            'mastercard',
            'amex',
            'diners',
            'hipercard',
            // 'discover',
            // 'jcb',
            // 'maestro'
        ],
        // Advanced Initialization Options
        niceNames: {
            visa: "Visa", 
            mastercard: "Mastercard", 
            amex: "American Express", 
            diners: "Diners Club", 
            hipercard: "Hipercard", 
            // discover: "Discover", 
            // jcb: "JCB",
            // maestro: "Maestro"
        },
        regExpNumCheck: "^[0-9]+$",
        // Allows for type guessing
        regExpApprox: {
            visa: "^4", 
            mastercard: "^5[1-5]", 
            amex: "^(34|37)", 
            diners: "^(30|36|38|39)",
            hipercard: "", 
            // discover: "^6011", 
            // jcb: "^35",
            // maestro: "^(5018|5020|5038|6304|6759|6761|6762|6763)"
        },
        // Begin guessing type at one character. All arrays to maintain similar type
        startNum: {
            visa: ['4'], 
            mastercard: ['5'], 
            amex: ['3'],
            diners: ['3'],     
            hipercard: [''],     
            // discover: ['6'], 
            // jcb: ['3', '2', '1'],
            // maestro: ['5', '6']
        },
        // Determine when to use validation
        cardLength: {
            visa: [13, 16], 
            mastercard: [16], 
            amex: [15],
            diners: [14],  
            hipercard: [''],     
            // discover: [16], 
            // jcb: [15, 16],
            // maestro: [12, 13, 14, 15, 16, 17, 18, 19]
        }
    },
    min = function(array) {
        return Math.min.apply( Math, array );
    },
    max = function(array) {
        return Math.max.apply( Math, array );
    },
    // Setup the Core Functionality of instantiating separate objects
    CardCheck = function(settings) {
        
        // Already instantiated
        if (this instanceof CardCheck) {

            // Setup Object & Array Properties here rather than in prototype
            // If you don't, then they are shared across all object instances
            this._callbacks = {};
            this._settings = {};

            // Assume this is a credit card number
            if (typeof settings === 'number' || typeof settings === 'string') {
                return this.options().cardNumber(settings);
            // Otherwise, assume this is a settings object
            } else {
                return this.options(settings);
            }

        // New Card Check
        } else {
            return new CardCheck(settings);
        }
    };

    // Setup the methods and properties of each instance
    CardCheck.prototype = {

        // Properties
        _cardNumber: null,
        _cardType: null,
        _isValid: undefined,
        _numCheck: null,

        // Set the Card Number
        // 
        // If no argument is passed, then return the number
        // 
        // @param  numeric  String or Integer
        // @return object   this instanceof CardCheck
        cardNumber: function(number) {

            // No argument was passed
            if (typeof number === 'undefined') {
                return this._cardNumber;
            }

            // Always force to a string
            number = number.toString();

            // Strip spaces if they are allowed
            if (this._settings.allowSpaces === true) {
                number = number.replace(/\s/g, '');
            }

            // Already processed, so no reason to do it again
            if (this._cardNumber === number) {
                return this;
            }

            this._cardNumber = number;
            return this.evaluate();
        },

        // Card Type
        // 
        // @param  boolean Returns a niceName of the type
        // @return string  Lowercase/NiceName of card
        cardType: function(niceName) {

            // Return null if no card type exists
            if ( ! this._cardType) {
                return null;
            }

            return niceName ?
                this._settings.niceNames[this._cardType]:
                this._cardType;
        },

        // NiceName
        // 
        // @param  string  card name
        // @return string  NiceName of Card
        niceName: function (card) {
            return this._settings.niceNames[card] ? this._settings.niceNames[card] : '';
        },

        // eachCard
        // 
        // Loops over every card in the settings
        // 
        // @param  function  Passed params ('cardName')
        // @return object    this instance of CardCheck
        eachCard: function(callback) {

            // Pass the callback the required params
            for (var i = 0; i < this._settings.acceptedCards.length; i++) {
                
                var // Pass the current cardname to the callback
                cardName = this._settings.acceptedCards[i],
                canContinue = callback(cardName);

                // Break loop of we should no longer continue
                if (canContinue === false) {
                    return false;
                }
            }

            return this;
        },

        // Evaluate Card Number
        // 
        // This is the heart of the functionality
        // It will set isValid and cardType
        // 
        // @return object  this instanceof CardCheck
        evaluate: function() {
            
            // Setup RegExp
            if ( ! this._numCheck ) {
                this._numCheck = new RegExp( this._settings.regExpNumCheck );
            }

            // No card number means its not valid
            // or one or fewer characters cannot be evaluated
            if ( ! this._cardNumber ) {
                this._switchState(null);
            // Card number passed is not a number
            } else if ( ! this._cardNumber.match( this._numCheck )) {
                this._switchState(false);
            // Evaluate the current cardNumber
            } else {
                
                // Loop over all the available cards
                var that = this;
                this.eachCard(function(card) {

                    // Check if we can guess it from one number
                    if ( that._cardNumber.length === 1 && card in that._settings.startNum ) {
                        // Continue because this could match a number of different cards
                        if ( that._cardNumber === '3' || that._cardNumber === '6' ) {
                            that._switchState(null);
                            return true;
                        // Found an approximate match to the card
                        } else if ( $.inArray(that._cardNumber, that._settings.startNum[card]) !== -1 ) {
                            that._switchState(null, card);
                            return false; // we found it!
                        }

                    // Quickly guess at discover after second character
                    } else if (that._cardNumber.length === 2 && (that._cardNumber === '60' || that._cardNumber === '65')) {
                        that._switchState(null, 'discover');
                        return false;
                    }

                    // Stores the regular expression
                    var exp,
                        fullValidation = false,
                        highestValue = false,
                        beyondLength = false;
                    
                    // Check if we should require full validation based on whether the max card length is reached
                    if ( card in that._settings.cardLength && $.inArray(that._cardNumber.length, that._settings.cardLength[card]) !== -1 ) {
                        fullValidation = true;
                    // Check if the length is greater than or equal to the max length of the card
                    } else if ( that._cardNumber.length >= max(that._settings.cardLength[card] ) ) {
                        fullValidation = true;
                        highestValue = true;
                        beyondLength = ( that._cardNumber.length > max(that._settings.cardLength[card] ) );
                    // Whether the _isValid is true OR if the current _cardNumber is less than minimum card length
                    // We can rely on the fact that we need to reset here if _isValid is TRUE because of the 
                    //  fact that the cardlength is not the current length of the string so it's impossible its still valid 
                    } else if ( that._isValid === true ) {
                        that._delayState(null);
                    }
                        
                    // Continue approximation with simple regex to test beginning of string
                    if ( card in that._settings.regExpApprox ) {
                        exp = new RegExp( that._settings.regExpApprox[card] );
                        
                        // Check the Type - Only validate if type is found
                        if ( that._cardNumber.match(exp) ) {
                            
                            // Check to see if we require full validation yet
                            if ( fullValidation === false ) {
                                that._switchState(null, card);
                                return false;
                            }
                            
                            // Check the LuhnCheck at this point to make sure that it validates
                            // NOTE: The luhn check can pass even if the card is not complete
                            // Example would be visa being able to have longer cards. 
                            if ( that.luhnCheck( that._cardNumber ) === true && ! beyondLength ) {
                                that._switchState(true, card);
                            // Soft Failure - there is another possibility with more chars
                            } else if ( highestValue ) {
                                that._switchState(false, card);
                            // Lower than min card length
                            } else if ( that._cardNumber.length < min(that._settings.cardLength[card]) ) {
                                that._switchState(null, card);
                            }
                            
                            // Something happened up above that requires a full stop           
                            return false;                   
                        }
                    }
                });
            }

            return this;
        },

        // LuhnCheck
        // 
        // @param  numeric
        // @return boolean
        luhnCheck: function(number) {
            var luhnArr = [[0,2,4,6,8,1,3,5,7,9],[0,1,2,3,4,5,6,7,8,9]],
                sum = 0;
            
            number.replace(/\D+/g,"").replace(/[\d]/g, function(c, p, o){
                sum += luhnArr[ (o.length - p) & 1 ][ parseInt(c, 10) ];
            });

            return ( sum % 10 === 0 ) && ( sum > 0 );
        },

        // Options
        // 
        // @param  object 
        // @return object  this instanceof CardCheck
        options: function(settings) {

            var card, setCard = false;
            settings = settings || {};

            // Setting the card number through options
            if (settings.cardNumber) {
                card = settings.cardNumber;
                setCard = true;
                delete settings.cardNumber;
            }

            // Apply all other options directly
            this._settings = $.extend({}, defaultSettings, settings);

            // Set Card Number if it has been defined
            if (setCard) {
                this.cardNumber(card);
            }

            return this;
        },

        // On Toggle 
        // 
        // Called only on a change of state from valid, invalid, and unknown
        // Passed param "true" if valid, "false" if now invalid, and "null" if 
        // unknown whether it is true or false. Too little information to go on.
        // 
        // @param  function  
        // @return object    this instanceof CardCheck
        onToggle: function(callback) {
            return this._setCallback('onToggle', callback);
        },

        // On Valid Callback
        // 
        // @param  function 
        // @return object   this instanceof CardCheck
        onValid: function(callback) {
            return this._setCallback('onValid', callback);
        },

        // On Validation Callback
        // 
        // @deprecated  use onValid instead
        // @param  function 
        // @return object   this instanceof CardCheck
        onValidation: function(callback) {
            return this.onValid(callback);
        },

        // On InValid
        // 
        // @param  function
        // @return object   this instanceof CardCheck
        onInvalid: function(callback) {
            return this._setCallback('onInvalid', callback);
        },

        // On Error
        // 
        // @deprecated  This use should be updated to use onInvalid
        // @param  function
        // @return object   this instanceof CardCheck
        onError: function(callback) {
            return this.onInvalid(callback);
        },

        // On Unknown
        // 
        // @param  function
        // @return object   this instanceof CardCheck
        onUnknown: function(callback) {
            return this._setCallback('onUnknown', callback);
        },

        // On Guess
        // 
        // Wraps the onUnknown callback to provide a simple
        // interface for knowning when a single card is 
        // most likely the card type someone is typing.
        // 
        // @param  function
        // @return object   this instanceof CardCheck
        onGuess: function(callback) {
            
            // If callback isn't a function, then don't set anything
            if (typeof callback !== 'function') {
                return this;
            }

            // Only on unknown that has a guess at the card
            return this.onUnknown(function(card) {
                if (card) {
                    callback(card);
                }
            });
        },

        // On Reset
        // 
        // Wraps the onUnknown method to listen to when
        // the object has been reset from success or failure
        // to an unknown state with no guess at card
        // 
        // @param  function
        // @return object   this instanceof CardCheck
        onReset: function(callback) {
            
            // If callback isn't a function, then don't set anything
            if (typeof callback !== 'function') {
                return this;
            }

            // Unknown with no card means that we've been reset
            return this.onUnknown(function(card) {
                if ( ! card) {
                    callback();
                }
            });
        },

        // On Card Change
        // 
        // @param  function
        // @return object   this instanceof CardCheck
        onCardChange: function(callback) {
            return this._setCallback('onCardChange', callback);
        },

        // On Type Update
        // 
        // @deprecated
        // @param  function
        // @return object   this instanceof CardCheck
        onTypeUpdate: function(callback) {
            return this.onCardChange(callback);
        },

        // Set Callback
        // 
        // @param  string
        // @param  function
        // @return object   this instanceof CardCheck
        _setCallback: function(type, callback) {

            // If callback isn't a function, then don't set anything
            if (typeof callback !== 'function') {
                return this;
            }

            // Default to empty array if not found
            if ( ! this._callbacks[type]) {
                this._callbacks[type] = [];
            }

            this._callbacks[type].push(callback);
            return this;
        },

        // Run Callbacks
        // 
        // @param  string  Accepted type of callback
        // @param  array   List of Arguments
        // @param  object  Context (defaults to CardCheck)
        _runCallbacks: function(type, args, context) {
            // Execute callbacks if any exist
            var callbacks = this._callbacks[type];
            if ( ! callbacks || callbacks.length === 0) {
                return this;
            }

            // Setup the vars for apply
            args = args || null;
            context = context || this;

            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i].apply(context, args);
            }

            return this;
        },

        // Set Card Type
        // 
        // @param  string  Set Specific Card Type
        // @return object  this instanceof CardCheck
        _setCardType: function(card) {

            // Trigger Card Change Callback
            if (this._cardType !== card) {
                this._runCallbacks('onCardChange', [ card, this.niceName(card) ]);
            }

            this._cardType = card;
            return this;
        },

        // Delay State
        // 
        // Will perform the exact same thing as switchState, 
        // but delay slightly to ensure that another match isn't found
        // 
        // This is most likely an invalid state, so we ignore it if 
        // another is set
        // 
        // @param  boolean
        // @param  string
        _delayState: function(isValid, card) {
            var that = this;

            setTimeout(function() {
                // Only call function if state has not been changed
                // to match my current state
                if (isValid !== that._isValid) {
                    that._switchState(isValid, card);
                }
            }, 50);

            return this;
        },

        // Switch State
        // 
        // Used internally after evaluation to set
        // the _isValid property.
        // 
        // Will execute onToggle, onValid, and onInvalid callbacks
        // 
        // @param  boolean
        // @param  string
        // @return object  this instanceof CardCheck
        _switchState: function(isValid, card) {

            // If card is not defined, we'll define it as null (default)
            if (typeof card === 'undefined') {
                card = null;
            }

            // No change to notify
            if (isValid === this._isValid && this._cardType === card) {
                return this;
            }

            // Card or Valid Changed, so update the card Number as well
            this._setCardType(card);

            // Store the new value
            this._isValid = isValid;

            // Call onValid
            if (isValid === true) {
                
                this._runCallbacks('onValid', [ card, this.niceName(card) ]);

            // Call onInvalid
            } else if (isValid === false) {

                this._runCallbacks('onInvalid');

            // Call onUnknown
            } else if (isValid === null) {

                this._runCallbacks('onUnknown', [ card, this.niceName(card) ]);

            }

            // Run OnToggle last so that the other more explicit methods fire first
            this._runCallbacks('onToggle', [ isValid, card, this.niceName(card) ]);

            return this;
        }
    };

    // Assign Card Check to the Window Object
    w.CardCheck = CardCheck;

    // All above this line is in cardcheck-standalone.js
    // Begin jQuery Plugin -----------------------------
    
    var // Need to do the CardCheckIcons
    CardCheckIcons = function($el, instanceID, options) {
        
        // Icons were disabled by user
        if (typeof options.enableIcons !== 'undefined' && options.enableIcons !== true) {
            this.disabled = true;
        }

        // Setup the settings by user provided or default settings
        this.$el = $el;
        this.uniqueClass = instanceID;
        this.acceptedCards = options.acceptedCards;

        // Will be defaulted if not provided
        this.iconLocation = options.iconLocation ? $(options.iconLocation): $el.parent();
        this.iconDir = options.iconDir ? options.iconDir : '../../img/cards/';
        this.iconExt = options.iconExt ? options.iconExt : 'png';
        this.iconClass = options.iconClass ? options.iconClass : 'card-icons';

        this.createIcons();

        // Cache all DOM nodes of image tags
        this.icons = $( '.' + this.iconClass + this.uniqueClass );

        return this;
    };

    // Helper methods to handle display of the icons
    CardCheckIcons.prototype = {
        createIcons: function() {

            if (this.disabled) {
                return this;
            }

            var that = this;

            $.each( that.acceptedCards, function( k, icon ) {
                $('.payments .form-control').append( $('<img>').attr( 'id', 'card-' + icon + that.uniqueClass )
                    .attr( 'src', that.iconDir + icon + '.' + that.iconExt )
                    .addClass( that.iconClass + that.uniqueClass ) );
            });

            return this;
        },
        showOnly: function(card) {

            if (this.disabled) {
                return this;
            }

            var that = this;
            this.hideExcept(card, function(card) {
                that.showCard(card);
            });
            return this;
        },
        showCard: function(card) {
            $('#card-' + card + this.uniqueClass).css('opacity', 1);
            return this;
        },
        showAll: function() {
            if (this.disabled) {
                return this;
            }

            this.icons.css('opacity', 1);
            return this;
        },
        hideExcept: function(card, complete) {
            if (this.disabled) {
                return this;
            }

            complete = complete || function() {};

            this.icons
                .not('#card-' + card + this.uniqueClass)
                .fadeTo('fast', 0.2, function() {
                    complete(card);
                });

            return this;
        },
        hideAll: function() {
            if (this.disabled) {
                return this;
            }

            this.icons.fadeTo('fast', 0.2);
            return this;
        }
    };

    // @example --> $.cardcheck( '#credit-card', { ... } );
    $.cardcheck = function(element, options) {

        // Used to store the card check instances of each 
        if ( ! w.CardCheckInstances) {
            w.CardCheckInstances = {};
        }

        // Check if options defined by element and remap
        // Allows initialization like $.cardcheck({ input: '#card-input' });
        if ( typeof element === 'object' && 'input' in element ) {
            options = element;
            element = options.input;            
        }

        // Default Options if CardCheck was initialized with no settings
        options = options || {};

        var // Setup private vars for this instance
        $el = $(element),
        card = new CardCheck(options),
        instanceID = Math.floor(Math.random()*1000),
        icons = new CardCheckIcons($el, instanceID, card._settings),
        Broadcast = function(event) {
            this.event = event;
            this.run = function(args) {
                $el.trigger('cc:' + this.event, args);
            };

            return this;
        },
        callbacks = ['onToggle', 'onValid', 'onValidation', 'onInvalid', 'onError',
            'onUnknown', 'onGuess', 'onReset', 'onCardChange', 'onTypeUpdate'
        ];

        $el.addClass('cardcheck-instance-' + instanceID).data('cardcheck-instance', instanceID);

        // Assing card to current object
        // Allows access to API directly from the $element
        // @example ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // var cardinput = $('#credit-card').cardcheck();
        // var instance = cardinput.cardcheck('instance')
        // instance.onValid(); --> ALL CardCheck methods available
        if ( ! w.CardCheckInstances[instanceID] ) {
            w.CardCheckInstances[instanceID] = card;
        }

        // Setup the Broadcast!
        for (var i = 0; i < callbacks.length; i++) {
            (function(callback) {
                
                // Broadcast if that method exists
                if (card[callback]) {
                    
                    var bc = new Broadcast(callback);
                    card[callback](function() {
                        bc.run(arguments);
                    });

                    // If this callback is found in the options, attempt to set it
                    if (options[callback]) {
                        card[callback]( options[callback] );
                    }
                }

            })(callbacks[i]);
        }
   
        card // Setup Callbacks for Icon Management
        .onInvalid(function() {
            icons.hideAll();
        }).onValid(function(card) {
            icons.showOnly(card);
        }).onGuess(function(card) {
            icons.showOnly(card);
        }).onReset(function() {
            icons.showAll();
        });

        // Update Card Number on User Input
        $el.on("keyup.cardcheck change.cardcheck", function() {
            card.cardNumber( $(this).val() );
        });

        // Trigger initialization complete
        // Allows for fetching the icons object
        $el.trigger('cc:initialized', [icons]);

        return $el;
    };

    // @example --> $('#credit-card').cardcheck( { ... } );
    $.fn.cardcheck = function(options) {

        // Already Instantiated. Fetching Internal Methods
        if ( $(this).data('cardcheck-instance') ) {

            var instance = w.CardCheckInstances[ $(this).data('cardcheck-instance') ];

            if (options === 'instance') {
                return instance;
            } else if (options === 'evaluate') {
                instance.evaluate();
                return $(this);
            }

        // CardCheck wasn't initialized yet
        } else if (options === 'instance' || options === 'evaluate') {
            return $(this);
        }

        // Instantiate the Plugin
        return this.each(function() {
            if ( $(this).data('cardcheck') !== true ) {
                return $.cardcheck(this, options).data('cardcheck', true);
            }
        });
    };
    
})(window, jQuery);