import dash
from dash import html, dcc
from dash.dependencies import Input, Output, State
import pandas as pd
import joblib
import os

app = dash.Dash(__name__, suppress_callback_exceptions=True)

# Load model
model = joblib.load("flight_price_model.pkl")

app = dash.Dash(__name__)
server = app.server  # for deployment

app.layout = html.Div([
    html.H1("✈️ Flight Price Predictor", style={'textAlign': 'center'}),

    html.Label("Airline"),
    dcc.Dropdown(["IndiGo", "Vistara", "SpiceJet", "AirAsia", "GoAir","Air_India","GO_FIRST"], id='airline'),

    html.Label("Source City"),
    dcc.Dropdown(["Delhi", "Mumbai", "Bangalore", "Kolkata","Hyderabad"], id='source_city'),

    html.Label("Departure Time"),
    dcc.Dropdown(["Morning", "Afternoon", "Evening", "Night","Early_Morning","Late_Night"], id='departure_time'),

    html.Label("Stops"),
    dcc.Dropdown(["zero", "one", "two_or_more"], id='stops'),

    html.Label("Arrival Time"),
    dcc.Dropdown(["Morning", "Afternoon", "Evening", "Night","Early_Morning","Late_Night"], id='arrival_time'),

    html.Label("Destination City"),
    dcc.Dropdown(["Delhi", "Mumbai", "Bangalore", "Kolkata","Hyderabad"], id='destination_city'),

    html.Label("Class"),
    dcc.RadioItems(["Economy", "Business"], id='class'),

    html.Label("Duration (hours)"),
    dcc.Slider(min=0.5, max=10, step=0.1, id='duration', value=2.5),

    html.Label("Days Left Until Departure"),
    dcc.Slider(min=1, max=60, step=1, id='days_left', value=15),

    html.Br(),
    html.Button("Predict Price", id='predict_btn', n_clicks=0),

    html.Div(id='prediction_result', style={'marginTop': 30, 'fontSize': 20})
])


@app.callback(
    Output('prediction_result', 'children'),
    Input('predict_btn', 'n_clicks'),
    State('airline', 'value'),
    State('source_city', 'value'),
    State('departure_time', 'value'),
    State('stops', 'value'),
    State('arrival_time', 'value'),
    State('destination_city', 'value'),
    State('class', 'value'),
    State('duration', 'value'),
    State('days_left', 'value')
)
def predict(n_clicks, airline, source_city, departure_time, stops, arrival_time,
            destination_city, travel_class, duration, days_left):
    
    if n_clicks > 0:
        user_input = pd.DataFrame({
            'airline': [airline],
            'source_city': [source_city],
            'departure_time': [departure_time],
            'stops': [stops],
            'arrival_time': [arrival_time],
            'destination_city': [destination_city],
            'class': [travel_class],
            'duration': [duration],
            'days_left': [days_left]
        })

        price = model.predict(user_input)[0]
        return f"💸 Predicted Flight Price: ₹ {round(price, 2)}"

    return ""


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8050)))

