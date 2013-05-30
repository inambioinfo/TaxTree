#!/usr/bin/env ruby

require 'pp';
require 'json';

# 367523  k__Bacteria; p__Bacteroidetes; c__Flavobacteriia; o__Flavobacteriales; f__Flavobacteriaceae; g__Flavobacterium; s__

if ARGV.empty?
  puts "Usage gg2json gg_12_10_taxonomy > gg.json"
  exit(1)
end

file = ARGV.shift

node = {}

File.open(file, 'r') do |ios|
  while not ios.eof?
    line = ios.readline.chomp
    tax_id, tax_string = line.split("\t");

    tax_string.scan(/\w__([^;]+)/).inject(node){|h,s| h[s[0].delete("[]")] ||= {} }; 
  end
end

puts node.to_json
