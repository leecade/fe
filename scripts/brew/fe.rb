require "language/node"

class Fe < Formula
  desc "Front-End Stack"
  homepage "https://github.com/leecade/fe"
  url "http://fe-1251421185.costj.myqcloud.com/fe-0.1.13.tar.gz"
  sha256 "a80e61ad5eb4668e0c086122b1d846cbf3388ea359aadc84ba0db5c3ee63e938"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system bin/"fe", "--version"
  end
end
