fn main() -> Result<(), Box<dyn std::error::Error>> {
    let event = fnhs_event_models::parse()?;
    println!("Event: {:?}", event);
    fnhs_event_models::custom::test_stringify()?;
    let event = fnhs_event_models::custom::test_parse()?;
    println!("Custom Event: {:?}", event);
    Ok(())
}
