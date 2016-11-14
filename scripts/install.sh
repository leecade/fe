#!/bin/sh
set -e

reset="\e[0m"
red="\e[0;31m"
green="\e[0;32m"
cyan="\e[0;36m"
white="\e[0;37m"

get_tarball() {
  printf "$cyan> Downloading tarball...$reset\n"
  curl -L -o fe.tar.gz "http://fe-1251421185.costj.myqcloud.com/latest.tar.gz" >/dev/null

  # printf "$cyan> Extracting to ~/.fe...$reset\n"
  mkdir .fe

  # strange, missing some modules after tar, example: replace​-​ext
  # may tar bug?
  tar zxf fe.tar.gz -C .fe --strip 1 # extract tarball
  rm -rf fe.tar.gz # remove tarball
}

install_link() {
  printf "$cyan> Adding to \$PATH...$reset\n"
  PROFILE="$(detect_profile)"
  SOURCE_STR="\nexport PATH=\"\$HOME/.fe/bin:\$PATH\"\n"
  local SHELLTYPE
  SHELLTYPE="$(basename "/$SHELL")"

  if [ -z "${PROFILE-}" ] ; then
    printf "$red> Profile not found. Tried ${PROFILE} (as defined in \$PROFILE), ~/.bashrc, ~/.bash_profile, ~/.zshrc, and ~/.profile.\n"
    echo "> Create one of them and run this script again"
    echo "> Create it (touch ${PROFILE}) and run this script again"
    echo "   OR"
    printf "> Append the following lines to the correct file yourself:$reset\n"
    command printf "${SOURCE_STR}"
  else
    if ! grep -q 'fe' "$PROFILE"; then
      if [[ $PROFILE == *"fish"* ]]; then
        command fish -c 'set -U fish_user_paths $fish_user_paths ~/.fe/bin'
      else
        command printf "$SOURCE_STR" >> "$PROFILE"
      fi
    fi

    printf "$green> Successfully installed! Run \"fe -h\" get started.$reset\n"
    printf "$white> If start failed add the following to your correct profile(maybe: $PROFILE):\n"
    printf "   $SOURCE_STR$reset\n"

    $HOME/.fe/bin/fe -v
    # ignore: `source ～／.zshrc` cause error "autoload command not found"
    source "$PROFILE" 2> /dev/null
    command ln -sf $HOME/.fe/bin/fe.js /usr/local/bin/fe
    command "$SHELLTYPE"
  fi
}

detect_profile() {
  if [ -n "${PROFILE}" ] && [ -f "${PROFILE}" ]; then
    echo "${PROFILE}"
    return
  fi

  local DETECTED_PROFILE
  DETECTED_PROFILE=''
  local SHELLTYPE
  SHELLTYPE="$(basename "/$SHELL")"

  if [ "$SHELLTYPE" = "bash" ]; then
    if [ -f "$HOME/.bashrc" ]; then
      DETECTED_PROFILE="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
      DETECTED_PROFILE="$HOME/.bash_profile"
    fi
  elif [ "$SHELLTYPE" = "zsh" ]; then
    DETECTED_PROFILE="$HOME/.zshrc"
  elif [ "$SHELLTYPE" = "fish" ]; then
    DETECTED_PROFILE="$HOME/.config/fish/config.fish"
  fi

  if [ -z "$DETECTED_PROFILE" ]; then
    if [ -f "$HOME/.profile" ]; then
      DETECTED_PROFILE="$HOME/.profile"
    elif [ -f "$HOME/.bashrc" ]; then
      DETECTED_PROFILE="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
      DETECTED_PROFILE="$HOME/.bash_profile"
    elif [ -f "$HOME/.zshrc" ]; then
      DETECTED_PROFILE="$HOME/.zshrc"
    elif [ -f "$HOME/.config/fish/config.fish" ]; then
      DETECTED_PROFILE="$HOME/.config/fish/config.fish"
    fi
  fi

  if [ ! -z "$DETECTED_PROFILE" ]; then
    echo "$DETECTED_PROFILE"
  fi
}

reset() {
  unset -f install reset get_tarball install_link detect_profile
}

install() {
  printf "${white}Installing FE...$reset\n"

  if [ -d "$HOME/.fe" ]; then
    # printf "$red> ~/.fe already exists, possibly from a past FE install.$reset\n"
    # printf "$red> Remove it (rm -rf ~/.fe) and run this script again.$reset\n"
    # exit 0
    # just remove it quietly
    rm -rf $HOME/.fe
  fi

  get_tarball
  install_link
  reset
}

cd ~
install
