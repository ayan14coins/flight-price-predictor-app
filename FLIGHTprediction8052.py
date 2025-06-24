import dash
from dash import html, dcc
from dash.dependencies import Input, Output, State
import pandas as pd
import joblib

# Load model and dataset
model = joblib.load("flight_price_model.pkl")
df = pd.read_csv("DataSet/Clean_Dataset.csv")

# Start Dash app
app = dash.Dash(__name__)
server = app.server  # for deployment

app.layout = html.Div([
    html.H1("✈️ Flight Price Predictor", style={
        'textAlign': 'center',
        'marginTop': '10px',
        'marginBottom': '20px',
        'color': '#003566',
        'fontFamily': 'Arial, sans-serif',
        'fontSize': '28px'
    }),

    html.Div([
        # Left Panel with two-column input fields
        html.Div([
            html.Div([
                html.Label("Airline", style={'fontWeight': 'bold', 'fontSize': '14px'}),
                dcc.Dropdown(df['airline'].unique(), id='airline', placeholder="Select Airline", style={'marginBottom': '10px'}),

                html.Label("Source City", style={'fontWeight': 'bold', 'fontSize': '14px'}),
                dcc.Dropdown(df['source_city'].unique(), id='source_city', placeholder="Select Source", style={'marginBottom': '10px'}),

                html.Label("Departure Time", style={'fontWeight': 'bold', 'fontSize': '14px'}),
                dcc.Dropdown(df['departure_time'].unique(), id='departure_time', placeholder="Select Departure Time", style={'marginBottom': '10px'}),

                html.Label("Stops", style={'fontWeight': 'bold', 'fontSize': '14px'}),
                dcc.Dropdown(df['stops'].unique(), id='stops', placeholder="Select Stops", style={'marginBottom': '10px'}),

                html.Label("Departure Date", style={'fontWeight': 'bold', 'fontSize': '14px'}),
                dcc.DatePickerSingle(
                    id='departure_date',
                    min_date_allowed=pd.Timestamp.today().date(),
                    max_date_allowed=(pd.Timestamp.today() + pd.Timedelta(days=60)).date(),
                    initial_visible_month=pd.Timestamp.today().date(),
                    placeholder="Select Date",
                    display_format='DD MMM YYYY',
                    day_size=30,
                    style={
                        'marginBottom': '10px',
                        'fontSize': '12px',
                        'width': '100%'
                    }
                ),
            ], style={
                'flex': '1 1 45%',
                'paddingRight': '10px',
                'minWidth': '280px'
            }),

            html.Div([
                html.Label("Arrival Time", style={'fontWeight': 'bold', 'fontSize': '14px'}),
                dcc.Dropdown(df['arrival_time'].unique(), id='arrival_time', placeholder="Select Arrival Time", style={'marginBottom': '10px'}),

                html.Label("Destination City", style={'fontWeight': 'bold', 'fontSize': '14px'}),
                dcc.Dropdown(df['destination_city'].unique(), id='destination_city', placeholder="Select Destination", style={'marginBottom': '10px'}),

                html.Label("Duration (in hours)", style={'fontWeight': 'bold', 'fontSize': '14px'}),
                dcc.Slider(min=0.5, max=50.0, step=0.01, id='duration', value=2.5,
                           tooltip={'placement': 'bottom'}, marks=None,
                           className="custom-slider", updatemode='drag'),
                html.Br(),

                html.Label("Class", style={'fontWeight': 'bold', 'fontSize': '14px'}),
                dcc.RadioItems(
                    df['class'].unique(),
                    id='class',
                    labelStyle={'display': 'inline-block', 'marginRight': '10px', 'fontSize': '14px'},
                    style={'marginBottom': '10px'}
                ),
            ], style={
                'flex': '1 1 45%',
                'paddingLeft': '10px',
                'minWidth': '280px'
            }),
        ], style={
            'flex': '1 1 100%',
            'display': 'flex',
            'flexWrap': 'wrap',
            'flexDirection': 'row',
            'padding': '10px 10px',
            'justifyContent': 'space-between'
        }),

        # Right Panel with Button + Output
        html.Div([
            html.Button("Predict Price", id='predict_btn', n_clicks=0,
                        style={
                            'backgroundColor': '#003566',
                            'color': 'white',
                            'padding': '12px 25px',
                            'border': 'none',
                            'borderRadius': '8px',
                            'fontSize': '16px',
                            'cursor': 'pointer',
                            'marginTop': '20px',
                            'width': '100%'
                        }),

            html.Div(id='prediction_result', style={
                'marginTop': 30,
                'fontSize': 18,
                'whiteSpace': 'pre-line',
                'textAlign': 'center',
                'color': '#212529',
                'fontFamily': 'Arial',
                'width': '100%'
            })
        ], style={
            'flex': '1 1 100%',
            'textAlign': 'center',
            'padding': '10px 20px',
            'minWidth': '280px'
        }),
    ], style={
        'display': 'flex',
        'flexWrap': 'wrap',
        'justifyContent': 'space-between',
        'margin': '10px 20px',
        'backgroundColor': '#f7f9fc',
        'borderRadius': '10px'
    }),

    html.Hr(style={'marginTop': '40px'}),

    html.Div("🚀 Built by ayan14coins | Model: flight_price_model.pkl",
             style={'textAlign': 'center', 'marginTop': 10, 'color': 'gray', 'fontSize': '13px'})
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
    State('departure_date', 'date')
)
def predict(n_clicks, airline, source_city, departure_time, stops, arrival_time,
            destination_city, travel_class, duration, departure_date):

    if n_clicks == 0:
        return ""

    if n_clicks == 0 or any(val is None for val in [airline, source_city, departure_time, stops, arrival_time, destination_city, travel_class, duration]):
        return "⚠️ Please fill in all the fields before predicting."


    if not departure_date:
        return "❗ Please select a valid departure date."

    # Calculate days_left from today
    days_left = (pd.to_datetime(departure_date).date() - pd.Timestamp.today().date()).days

    if days_left < 0 or days_left > 60:
        return "❗ Departure date must be within the next 60 days."

    # 1. Build user input for prediction
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

    # 2. Predict single price
    predicted_price = model.predict(user_input)[0]
    predicted_price = round(predicted_price, 2)
    


    # 3. Find matching flights from dataset
    filtered = df[
        (df['airline'] == airline) &
        (df['source_city'] == source_city) &
        (df['departure_time'] == departure_time) &
        (df['stops'] == stops) &
        (df['arrival_time'] == arrival_time) &
        (df['destination_city'] == destination_city) &
        (df['class'] == travel_class) &
        (df['duration'] <= duration) 
    ]

    flights_info = filtered[['airline', 'flight', 'duration']].drop_duplicates()
    
    if not flights_info.empty:
        flights_text = "\n".join(f"{row.airline} - Flight: {row.flight} - Duration: {row.duration}hrs" for _, row in flights_info.iterrows())
    else:
        flights_text = "No matching flights found."

    return html.Div([
    html.H2(f"💸 Predicted Price: ₹{predicted_price}", style={
        'color': '#003566',
        'fontWeight': 'bold',
        'marginBottom': '20px',
        'fontSize': '26px'
    }),
    html.H4("📋 Top Matching Flights:", style={
        'color': '#212529',
        'fontWeight': 'bold',
        'marginBottom': '10px',
        'fontSize': '20px'
    }),
    html.Ul([
        html.Li(f"{row.airline} - Flight: {row.flight} - Duration: {int(row.duration)}hrs {int(round((row.duration - int(row.duration)) * 60))}m", style={'fontSize': '16px'})
        for _, row in flights_info.iterrows()
    ]) if not flights_info.empty else html.P("No matching flights found.", style={'fontSize': '16px', 'color': 'gray'})
])

    


if __name__ == '__main__':
    app.run(debug=True, port=8052)
