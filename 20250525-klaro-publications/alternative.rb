require 'active_support/core_ext/date'
require 'path'
require 'bmg'
require 'json'
require "minitest/autorun"

articles = [
  { "id": 1, "publication_date": Date.parse("2025-01-02"), "title": "Out of the Tar Pit" },
  { "id": 2, "publication_date": Date.parse("2025-01-17"), "title": "Relations as First-Class Citizen" },
  { "id": 3, "publication_date": Date.parse("2025-03-11"), "title": "Bmg, a Relational Algebra" }
]

min = articles.map{|a| a[:publication_date] }.min.beginning_of_month
max = articles.map{|a| a[:publication_date] }.max.beginning_of_month

columns = Hash.new
current = min
while current <= max
  columns[current] = []
  current = current.next_month
end

articles.each do |article|
  columns[article[:publication_date].beginning_of_month] << article
end

puts JSON.pretty_generate(columns)
