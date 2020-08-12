fn main() -> Result<(), Box<dyn std::error::Error>> {
    let event = fnhs_event_models::parse()?;
    println!("Event: {:?}", event);
    let event = fnhs_event_models::custom_parse()?;
    println!("Custom Event: {:?}", event);
    Ok(())
}
