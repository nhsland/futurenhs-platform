fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Event");
    let event = fnhs_event_models::parse()?;
    println!("{:?}", event);

    println!("Custom Event");
    fnhs_event_models::custom::test_stringify()?;
    let event = fnhs_event_models::custom::test_parse()?;
    println!("{:?}", event);

    println!("Using Data Version");
    fnhs_event_models::using_data_version::test_stringify()?;
    let event = fnhs_event_models::using_data_version::test_parse()?;
    println!("{:?}", event);
    Ok(())
}
