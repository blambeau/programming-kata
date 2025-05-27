require 'active_support/core_ext/date'
require 'path'
require 'bmg'
require 'json'
require "minitest/autorun"

def group_articles_per_month(articles, hide_empty_columns = false)
  monthly_articles = articles.extend({
    month: ->(t) { t[:publication_date].beginning_of_month },
  })
  all_months = if hide_empty_columns
    monthly_articles.project([:month])
  else
    minmax = monthly_articles.summarize([], {
      :min => Bmg::Summarizer.min(:month),
      :max => Bmg::Summarizer.max(:month),
    }).one
    Bmg.generate(minmax[:min], minmax[:max], step: ->(d){ d.next_month }, as: :month)
  end
  all_months.image(monthly_articles, :articles, [:month])
end

class Test < Minitest::Test

  def articles
    @articles ||= Bmg::Relation.json_file(Path.dir/"articles.json").transform({
      publication_date: Date,
    })
  end

  def minmax
    @minmax ||= articles.summarize([], {
      :min => Bmg::Summarizer.min(:publication_date),
      :max => Bmg::Summarizer.max(:publication_date),
    }).transform(&:beginning_of_month).one
  end

  def test_it_seems_correct_at_first_glance
    result = group_articles_per_month(articles, false)
    assert_equal(result.count, 3)
    assert_equal(
      result
        .transform({
          :articles => :count,
          :month => :to_s
        })
        .y_by_x(:articles, :month),
      {"2025-01-01" => 2, "2025-02-01" => 0, "2025-03-01" => 1}
    )
  end

  def test_it_meets_the_postconditions
    result = group_articles_per_month(articles, false)
    result = result.extend(:next_month => ->(t) { t[:month].next_month })

    # is correct
    assert_empty (
      result
        .ungroup(:articles)
        .exclude(Predicate.between(:publication_date, :month, :next_month))
    )

    # is complete
    assert_empty (
      articles
        .not_matching(result.ungroup(:articles), [:id])
    )

    # is continuous
    assert_empty (
      result
        .exclude(month: minmax[:min])
        .not_matching(
          result
            .project([:next_month])
            .rename(next_month: :month),
          [:month]
        )
    )

    # is minimal
    assert_empty (
      result
        .restrict(month: minmax.values)
        .restrict(Predicate.empty(:articles))
    )
  end

end
