"use strict";

module.exports = Object.freeze({
    states: {
    	FINISH_MODE: '_FINISH_MODE',
    	CANCEL_MODE: '_CANCEL_MODE',
    	REPEAT_MODE: '_REPEAT_MODE'
    },
	
	intents: {
		LAUNCH_INTENT: 'LaunchRequest',
		ORDER_PRODUCT_INTENT: 'OrderProductIntent',
		ORDER_PRODUCT_WITH_QUANTITY_INTENT: 'OrderProductWithQuantityIntent',
		ORDER_QUANTITY_INTENT: 'OrderQuantityIntent',
		REPEAT_ORDER_INTENT: 'RepeatOrderIntent',
		FINISH_ORDER_INTENT: 'FinishOrderIntent',
		CANCEL_ORDER_INTENT: 'CancelOrderIntent',
		SESSION_ENDED_INTENT: 'SessionEndedRequest',
		YES_INTENT: 'AMAZON.YesIntent',
		NO_INTENT: 'AMAZON.NoIntent',
		REPEAT_INTENT: 'AMAZON.RepeatIntent',
		HELP_INTENT: 'AMAZON.HelpIntent',
		STOP_INTENT: 'AMAZON.StopIntent',
		CANCEL_INTENT: 'AMAZON.CancelIntent',
		UNHANDLED_INTENT: 'Unhandled'
	},
	
	events: {
		NEW_SESSION: 'newSession',
		SAVE_ORDER: 'saveOrder',
		CANCEL_ORDER: 'cancelOrder',
		CONTINUE_ORDER: 'continueOrder',
		ADD_PRODUCT: 'addProduct',
		CANCEL_EVENT: 'cancelEvent',
		REPEAT_ORDER: 'repeatOrder'
	},
	
	speeches: {
		WELCOME_SPEECH: 'welcomeSpeech',
		REPEAT_ORDER_SPEECH: 'repeatOrderSpeech',
		FINISH_ORDER_SPEECH: 'finishOrderSpeech',
		CANCEL_ORDER_SPEECH: 'cancelOrderSpeech',
		CONTINUE_ORDER_SPEECH: 'continueOrderSpeech',
		REPEAT_SPEECH: 'repeatSpeech',
		HELP_SPEECH: 'helpSpeech',
		GOODBYE_SPEECH: 'goodbyeSpeech',
		UNHANDLED_SPEECH: 'unhandledSpeech',
		FATAL_SPEECH: 'fatalSpeech',
		PRODUCT_ADDED_SPEECH: 'productAddedSpeech',
		PRODUCT_STARTED_SPEECH: 'productStartedSpeech',
		QUANTITY_STARTED_SPEECH: 'quantityStartedSpeech',
		PRODUCT_IN_PROGRESS_SPEECH: 'productInProgressSpeech',
		QUANTITY_IN_PROGRESS_SPEECH: 'quantityInProgressSpeech',
		PRODUCT_NOT_FOUND_SPEECH: 'productNotFoundSpeech',
		ORDER_SAVED_SPEECH: 'orderSavedSpeech',
		ORDER_CANCELLED_SPEECH: 'orderCancelledSpeech',
		PRODUCT_REMOVED_SPEECH: 'productRemovedSpeech',
		NO_PRODUCTS_SPEECH: 'noProductsSpeech',
		REPEAT_ORDER_MULTI_SPEECH: 'repeatOrderMultiSpeech',
		ERROR_SPEECH: 'errorSpeech'
	},
	
	speechOutputs: {
		WELCOME_SPEECH: 'Welcome to <say-as interpret-as="spell-out">us</say-as> foods quick order! Please state the product and quantity you\'d like to order',
		REPEAT_ORDER_SPEECH: 'Here is your order so far %s. You can continue adding more products',
		REPEAT_ORDER_MULTI_SPEECH: 'Here is your order so far %s. Would you like to hear more items on your order?',
		NO_PRODUCTS_SPEECH: 'You don\'t have any completed products added to your order yet',
		FINISH_ORDER_SPEECH: 'Would you like to complete your order?',
		CANCEL_ORDER_SPEECH: 'Would you like to cancel your order? All data will be lost!',
		CONTINUE_ORDER_SPEECH: 'Please state the product and quantity you\'d like to order',
		PRODUCT_ADDED_SPEECH: 'I\'ve added %d cases of %s to your order. You can continue adding products or finish the order',
		PRODUCT_STARTED_SPEECH: 'I found the product %s. How many cases do you need?',
		QUANTITY_STARTED_SPEECH: 'You asked for %d cases. What product is this for?',
		PRODUCT_IN_PROGRESS_SPEECH: 'You already started ordering the product %s. How many cases do you want for it?',
		QUANTITY_IN_PROGRESS_SPEECH: 'You already asked for %d cases but I don\'t know for which product. Which product is it for?',
		PRODUCT_NOT_FOUND_SPEECH: 'I\'m sorry, the product you wanted could not be found or is not available at this time. Please order another',
		HELP_SPEECH: 'Order a product by asking for the product name and quantity. You can hear your order so far by saying. Repeat my order. To finish the order say. Finish my order or complete the order',
		ORDER_SAVED_SPEECH: 'Congratulations! Your order is saved. Please go to your account online to review and submit the order. Goodbye!',
		ORDER_CANCELLED_SPEECH: 'Your order has been cancelled. Please place another order soon! Goodbye!',
		PRODUCT_REMOVED_SPEECH: 'The product was removed from the order. You can continue adding products or finish the order',
		UNHANDLED_SPEECH: 'I\'m sorry I couldn\'t understand that. Please try again',
		ERROR_SPEECH: 'I had a problem fulfilling your request. Please try it again'
	},
	
	reprompts: {
		WELCOME_SPEECH: 'Please state the product and quantity you\'d like to order, for example, I need 4 cases of pepperoni',
		REPEAT_ORDER_SPEECH: 'Here is your order so far %s. You can continue adding more product',
		REPEAT_ORDER_MULTI_SPEECH: 'Here is your order so far %s. Would you like to hear more items on your order, yes or no?',
		NO_PRODUCTS_SPEECH: 'You don\'t have any completed products added to your order yet. Please state the product and quantity you\'d like to order',
		FINISH_ORDER_SPEECH: 'Would you like to complete your order, yes or no?',
		CANCEL_ORDER_SPEECH: 'Would you like to cancel your order? All data will be lost! Yes or no?',
		CONTINUE_ORDER_SPEECH: 'Please state the product and quantity you\'d like to order, for example, I need 4 cases of pepperoni',
		PRODUCT_ADDED_SPEECH: 'I\'ve added %d cases of %s to your order. You can continue adding products or finish the order',
		PRODUCT_STARTED_SPEECH: 'I found the product %s. How many cases do you need?',
		QUANTITY_STARTED_SPEECH: 'You asked for %d cases, but I\'m not sure which product you\'d like. What product is this for?',
		PRODUCT_IN_PROGRESS_SPEECH: 'You already started ordering the product %s. How many cases do you want for it? Or you can say cancel if you don\t want to order it',
		QUANTITY_IN_PROGRESS_SPEECH: 'You already asked for %d cases but I don\'t know for which product. Which product is it for? Or you can say cancel if you don\t want to order it',
		PRODUCT_NOT_FOUND_SPEECH: 'I\'m sorry, the product you wanted could not be found or is not available at this time. Please order another',
		PRODUCT_REMOVED_SPEECH: 'The product was removed from the order. You can continue adding products or finish the order',
		HELP_SPEECH: 'Order a product by asking for the product name and quantity. You can hear your order so far by saying. Repeat my order. To finish the order say. Finish my order or complete the order',
		UNHANDLED_SPEECH: 'I\'m sorry I couldn\'t understand that. ',
		ERROR_SPEECH: 'I had a problem fulfilling your request. Please try it again or '
	},
	
	cardTitles: {
		WELCOME_CARD: 'Welcome to US Foods\' Quick Order!',
		REPEAT_ORDER: 'Your Order So Far',
		ORDER_SAVED: 'Your Order is Saved',
		ORDER_CANCELLED: 'Your Order is Cancelled',
		PRODUCT_ADDED: 'Product Added',
	},
	
	cards: {
		WELCOME_CARD: 'State the product and quantity you\'d like to order',
		ORDER_SAVED: 'To review and submit your order go to your account online',
		ORDER_CANCELLED: 'Please place another order soon!',
		PRODUCT_ADDED: '%d cases of %s has been placed on your order'
	},
	
    //  Custom constants
    terminate: 'TERMINATE',
});