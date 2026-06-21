# tests/test_oracles.py
import pytest
from gltest import get_contract_factory


def test_weather_oracle_deploy():
    factory = get_contract_factory("WeatherOracle")
    contract = factory.deploy(args=["Hanoi", "https://your-gateway.com/weather?city={city}"])
    assert contract.address is not None


def test_weather_oracle_fetch():
    factory = get_contract_factory("WeatherOracle")
    contract = factory.deploy(args=["Hanoi", "https://your-gateway.com/weather?city={city}"])
    contract.fetch_weather()
    temp = contract.get_temperature()
    assert temp != ""