-set-requirements-command = /set_requirements
-bot-name = InstantHomeHunt

# bot info
bot-info-description =
    🏠 InstantHomeHunt is your lightning-fast property search assistant!
    Get real-time alerts for the latest offers from OLX and Otodom, set custom requirements, and find your dream property before others do!
bot-info-short-description =
    🏠 InstantHomeHunt is your lightning-fast property search assistant!

# start command
start-message =
    🏠 Welcome to the { -bot-name }! I'm here to help you discover your ideal place.

    To get started, please tell me about your dream property using the { -set-requirements-command } command. Once you've set your preferences, I'll keep an eye out and notify you whenever I find matching properties.

    Happy house hunting! 🔍🏡

start-message-already-subscribed =
    Welcome back! 👋 It's great to see you again.

    I'm still actively searching for properties that match your requirements. If you'd like to update your preferences, just use the { -set-requirements-command } command.

# set requirements conversation
set-requirements-start = Hi! I'll help you set up your preferences for offers you will be notified about. Let's get started!
set-requirements-property-type-question = What type of property are you interested in?
set-requirements-ownership-type-question = Great choice! Are you looking to buy or rent?
set-requirements-location-name-question = Understood. Now, where are you looking for this property? Please provide the city name.
set-requirements-location-distance-question = How far from this location would you like to search? (Enter distance in kilometers, or type "0" if not applicable)
set-requirements-min-price-question = Great! Now, let's set the minimum price in PLN (optional). Enter a number or type "skip" to omit.
set-requirements-max-price-question = Great! Now, let's set the maximum price in PLN (optional). Enter a number or type "skip" to omit.
set-requirements-min-size-question = Great! Now, let's set the minimum size in square meters (m²) (optional). Enter a number or type "skip" to omit.
set-requirements-max-size-question = Finally, let's set the maximum size in square meters (m²) (optional). Enter a number or type "skip" to omit.
set-requirements-save-finish = I've saved these preferences and will start sending you notifications when matching offers are found. You can update these preferences anytime by typing { -set-requirements-command }
set-requirements-finish = Thank you for providing all the details.
set-requirements-summary-message = Here's a summary of your requirements:
show-requirement-not-found = You have no any requirements about offers. You can update these preferences anytime by typing { -set-requirements-command }

offer-alert-message =
    🏠 New Home Hunt Alert!

    {$title}
    📍 Location: {$location}
    💰 Price: {$price} PLN
    🌐 [View Offer]({$url})

# validation
optional-numeric-input-error = Please enter a valid number or type "skip" to omit.`
optional-numeric-input-boundary-error = Please enter a valid number greater than or equal to {$minValue} or type "skip" to omit.
invalid-input-using-buttons = Please use the provided buttons to make your selection. If you don't see the buttons, you may need to update your Telegram app.

# common
property-type = Property type
purpose = Purpose
location = Location
distance-range-value = (+{$distance} km)
price = Price
size = Size
lower-bound-range = from {$min} {$unit}
upper-bound-range = up to {$max} {$unit}
full-range = from {$min} {$unit} up to {$max} {$unit}